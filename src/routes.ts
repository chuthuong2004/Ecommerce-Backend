import { Express, Request, Response } from 'express';
export default function(app: Express) {
    app.get('/healthcheck', (req: Request, res: Response) => {
        return res.sendStatus(200)
    })
    // * REGISTER USER 
    // POST /api/user

    // * LOGIN USER
    // POST /api/session

    // * GET THE USER'S SESSIONS
    // GET /api/sessions

    // * LOGOUT
    // DELETE /api/sessions

    // GET /api/posts
}