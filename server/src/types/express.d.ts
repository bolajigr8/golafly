declare global {
  namespace Express {
    interface Request {
      user?: {
        /** MongoDB ObjectId string extracted from the verified JWT payload */
        id: string
        /** User's email address extracted from the verified JWT payload */
        email: string
      }
    }
  }
}

export {}
