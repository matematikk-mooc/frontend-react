const fs = require('fs').promises;
const path = require('path');

const jsonFilePath = path.join(__dirname, '../../playwright-report/results.json');
const outputFilePath = path.join(__dirname, '../../playwright-report/report.md');

function removeAnsiCodes(str) {
    if (!str) return str;
    return str.replace(/\u001b\[[0-9;]*m/g, '');
}

function extractErrorDetails(errorObj, errorsArray, attachments) {
    let log = '';

    if (Array.isArray(errorsArray) && errorsArray.length > 0) {
        for (const err of errorsArray) {
            if (err.message) log += `${removeAnsiCodes(err.message)}\n`;
            if (err.location) {
                log += `Location: ${err.location.file}:${err.location.line}:${err.location.column}\n`;
            }
        }
    }

    if (errorObj?.message) {
        log += `${removeAnsiCodes(errorObj.message)}\n`;
    }

    if (Array.isArray(attachments) && attachments.length > 0) {
        log += `Attachments:\n`;
        for (const attachment of attachments) {
            log += `  - ${attachment.name}: ${attachment.path}\n`;
        }
    }

    return log.trim();
}

function formatDuration(ms) {
    return `${(ms / 1000).toFixed(2)}ms`;
}

function formatTitle(title, level, type) {
    if (type === 'suite') {
        // Suite headings: bold
        // If indentLevel=2: "**- Title**"
        // If indentLevel=3: "**-- Title**"
        let prefix = '';
        if (level > 1) {
            prefix = `${'-'.repeat(level - 1)} `;
        }
        return `**${prefix}${title}**`;
    } else {
        // For tests:
        // level=1: no dash
        // level=2: "- Title"
        // level=3: "-- Title"
        if (level <= 1) {
            return title;
        } else {
            return `${'-'.repeat(level - 1)} ${title}`;
        }
    }
}
function collectTests(suite, indentLevel = 0) {
    let rows = [];

    // Only add suite row if indentLevel >= 2, so deeper nested suites show up as headings
    if ((suite.specs && suite.specs.length > 0) || (suite.suites && suite.suites.length > 0)) {
        if (indentLevel >= 2) {
            rows.push({
                type: 'suite',
                title: suite.title,
                indentLevel,
            });
        }
    }

    // Collect specs (tests)
    if (suite.specs) {
        for (const spec of suite.specs) {
            for (const test of spec.tests) {
                const projectId = test.projectId || 'N/A';
                const runnerId =
                    test.results[0]?.workerIndex !== undefined
                        ? `#${test.results[0].workerIndex + 1}`
                        : 'N/A';
                const statusIcon = test.status === 'expected' ? '✅ Passed' : '❌ Failed';
                const duration = formatDuration(test.results[0]?.duration || 0);

                rows.push({
                    type: 'test',
                    projectId,
                    runnerId,
                    title: spec.title,
                    indentLevel: indentLevel + 1,
                    statusIcon,
                    duration,
                    failed: test.status !== 'expected',
                    specTitle: spec.title,
                    errorObj: test.results[0]?.error,
                    errorsArr: test.results[0]?.errors,
                    attachments: test.results[0]?.attachments,
                });
            }
        }
    }

    // Recursively handle nested suites
    if (suite.suites) {
        for (const nestedSuite of suite.suites) {
            rows = rows.concat(collectTests(nestedSuite, indentLevel + 1));
        }
    }

    return rows;
}

function postProcessRows(rows) {
    // If first row is a suite at indentLevel=1, remove it and shift all indentLevels by -1
    if (rows.length > 0 && rows[0].type === 'suite' && rows[0].indentLevel === 1) {
        rows.shift();
        for (const row of rows) {
            row.indentLevel -= 1;
        }
    }

    // Normalize indent levels: ensure minimum indent > 0 rows start at 1
    let minLevel = Infinity;
    for (const row of rows) {
        if (row.indentLevel > 0 && row.indentLevel < minLevel) {
            minLevel = row.indentLevel;
        }
    }

    // If minLevel is large and > 1, shift everything down
    if (minLevel !== Infinity && minLevel > 1) {
        const shift = minLevel - 1;
        for (const row of rows) {
            row.indentLevel -= shift;
        }
    }

    return rows;
}

function generateMarkdownReport(data) {
    let markdown = `# 🎭 Playwright\n\n`;

    const stats = data.stats;
    const runnerCount = data.config.metadata.actualWorkers || 1;
    const formattedDuration = formatDuration(stats.duration);

    markdown += `## 📊 Summary\n`;
    markdown += `| Metric          | Value              |\n`;
    markdown += `|-----------------|--------------------|\n`;
    markdown += `| **Total Tests** | ${stats.expected + stats.unexpected} 🧪         |\n`;
    markdown += `| **Passed**      | ${stats.expected} ✅             |\n`;
    markdown += `| **Failed**      | ${stats.unexpected} ❌           |\n`;
    markdown += `| **Duration**    | ${formattedDuration} ⏱️ |\n`;
    markdown += `| **Runners**     | ${runnerCount} 🏃‍♂️          |\n\n`;

    markdown += `## 📝 Test Results\n`;

    let errorLogs = '';

    for (const suite of data.suites) {
        let rows = collectTests(suite, 0);
        // Post process rows to handle duplicate headings and indentation
        rows = postProcessRows(rows);

        if (rows.length > 0) {
            markdown += `### Suite: ${suite.file}\n\n`;
            markdown += `| Project ID     | Runner | Test Title                | Status       | Duration   |\n`;
            markdown += `|----------------|--------|---------------------------|--------------|------------|\n`;

            for (const row of rows) {
                if (row.type === 'suite') {
                    const formattedTitle = formatTitle(row.title, row.indentLevel, 'suite');
                    markdown += `|  |  | ${formattedTitle} |  |  |\n`;
                } else if (row.type === 'test') {
                    const formattedTitle = formatTitle(row.title, row.indentLevel, 'test');
                    markdown += `| ${row.projectId} | ${row.runnerId} | ${formattedTitle} | ${row.statusIcon} | ${row.duration} |\n`;

                    if (row.failed) {
                        const errorDetail = extractErrorDetails(
                            row.errorObj,
                            row.errorsArr,
                            row.attachments,
                        );
                        errorLogs += `### ❌ ${row.specTitle} (Runner: ${row.runnerId})\n\n`;
                        errorLogs += `\`\`\`\n${errorDetail}\n\`\`\`\n\n`;
                    }
                }
            }
        }
    }

    if (errorLogs) {
        markdown += `## 🔥 Error Details\n\n`;
        markdown += errorLogs;
    }

    return markdown;
}

async function main() {
    try {
        const jsonString = await fs.readFile(jsonFilePath, 'utf8');
        const jsonData = JSON.parse(jsonString);
        const markdownReport = generateMarkdownReport(jsonData);

        await fs.writeFile(outputFilePath, markdownReport, 'utf8');
        console.log('✅ Markdown report generated:', outputFilePath);
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();
