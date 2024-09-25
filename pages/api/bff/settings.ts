import type { NextApiHandler } from 'next';

const handler: NextApiHandler = (_req, res) => {
    res.status(200).json({ name: 'John Doe' });
};

export default handler;
