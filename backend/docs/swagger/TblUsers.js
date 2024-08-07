/**
 * @swagger
 * /api/users/v1/signup:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint registers a new user by creating an account with an email and password. It returns user data including a unique system ID and a hashed password for security.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userLoginID
 *               - userPassword
 *             properties:
 *               userLoginID:
 *                 type: string
 *                 description: The email address of the user acting as the login ID.
 *                 example: "user@example.com"
 *               userPassword:
 *                 type: string
 *                 description: The password for the account, which will be securely stored after hashing.
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Successfully created the user account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User created successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     TblSysNoID:
 *                       type: integer
 *                       example: 1
 *                     userLoginID:
 *                       type: string
 *                       example: "user@example.com"
 *                     userPassword:
 *                       type: string
 *                       example: "hashedpassword123"
 *                     userLoginStatus:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: The request contains invalid or improperly formatted data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Bad request."
 *       422:
 *         description: One or more fields failed validation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 422
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         example: "user@example.com"
 *                       msg:
 *                         type: string
 *                         example: "Invalid value."
 *                       param:
 *                         type: string
 *                         example: "userLoginID"
 *                       location:
 *                         type: string
 *                         example: "body"
 *       500:
 *         description: An internal server error occurred during account creation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */

/**
 * @swagger
 * /api/users/v1/login:
 *   post:
 *     summary: Authenticate User
 *     description: Authenticates a user by verifying their email and password, granting access to the system if credentials are valid.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userLoginID
 *               - userPassword
 *             properties:
 *               userLoginID:
 *                 type: string
 *                 description: The user's email address used as a login identifier.
 *                 example: "user@example.com"
 *               userPassword:
 *                 type: string
 *                 description: The user's password associated with the account.
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User successfully authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful."
 *                 user:
 *                   type: object
 *                   description: Contains detailed information about the user's profile and roles.
 *                   properties:
 *                     userID:
 *                       type: integer
 *                       example: 1
 *                     userName:
 *                       type: string
 *                       example: "John Doe"
 *                     userRole:
 *                       type: string
 *                       example: "Administrator"
 *                     userStatus:
 *                       type: string
 *                       example: "Active"
 *       422:
 *         description: Validation error due to incorrect login details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 422
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed due to invalid credentials."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "Invalid userLoginID or password."
 *       500:
 *         description: An internal server error occurred preventing user authentication.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error. Please try again later."
 */

/**
 * @swagger
 * /api/users/v1/verify-email:
 *   post:
 *     summary: Verify user email
 *     description: Verifies the user's email and activates the user account.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userLoginID
 *             properties:
 *               userLoginID:
 *                 type: string
 *                 description: The email address to verify.
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully."
 *                 token:
 *                   type: string
 *                   description: Authentication token issued upon successful email verification.
 *       404:
 *         description: No user found with the provided email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email verification failed."
 *       422:
 *         description: Validation error for incorrect or missing email format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 422
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "Invalid userLoginID."
 *       500:
 *         description: An internal server error occurred during the verification process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */

/**
 * @swagger
 * /api/users/v1/reset:
 *   put:
 *     summary: Reset user password
 *     description: Resets the password for an existing user account. This action requires user authentication.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userLoginID
 *               - newPassword
 *             properties:
 *               userLoginID:
 *                 type: string
 *                 description: The email address of the user whose password is to be reset.
 *                 example: "user@example.com"
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set for the user.
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully."
 *       400:
 *         description: Invalid request due to incorrect data format or missing fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Bad request."
 *       404:
 *         description: No user found with the provided email address.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       422:
 *         description: Validation error for incorrect or incomplete data submitted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 422
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         example: "user@example.com"
 *                       msg:
 *                         type: string
 *                         example: "Invalid value."
 *                       param:
 *                         type: string
 *                         example: "userLoginID"
 *                       location:
 *                         type: string
 *                         example: "body"
 *       500:
 *         description: An internal server error occurred during the password reset process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/users/v1/logout:
 *   put:
 *     summary: Logout user
 *     description: Logs out a user by setting their login status to 0. This endpoint requires a Bearer Token for authentication.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /api/users/v1/all:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Fetches all users from the database.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Users found"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       TblSysNoID:
 *                         type: integer
 *                         example: 1
 *                       UserLoginID:
 *                         type: string
 *                         example: "user@example.com"
 *                       UserPassword:
 *                         type: string
 *                         example: "$2b$10$AX1UFxFrSbMTTISomWAmVuMAvvFB64xG4zUGEouMTNY9XW/xvydhC"
 *                       UserLoginStatus:
 *                         type: integer
 *                         example: 1
 *       404:
 *         description: No users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No users found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/users/v1/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by ID from the database.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user to be deleted
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     TblSysNoID:
 *                       type: integer
 *                       example: 1
 *                     UserLoginID:
 *                       type: string
 *                       example: "user@example.com"
 *                     UserPassword:
 *                       type: string
 *                       example: "$2b$10$AX1UFxFrSbMTTISomWAmVuMAvvFB64xG4zUGEouMTNY9XW/xvydhC"
 *                     UserLoginStatus:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/users/v1/{id}:
 *   put:
 *     summary: Update a user
 *     description: Updates a user's information in the database by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserLoginID:
 *                 type: string
 *                 description: "Login ID of the user."
 *                 example: "user@example.com"
 *               UserPassword:
 *                 type: string
 *                 description: "Password of the user."
 *                 example: "password123"
 *               UserLoginStatus:
 *                 type: integer
 *                 description: "Login status of the user."
 *                 example: 1
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     TblSysNoID:
 *                       type: integer
 *                       example: 1
 *                     UserLoginID:
 *                       type: string
 *                       example: "user@example.com"
 *                     UserPassword:
 *                       type: string
 *                       example: "newpassword123"
 *                     UserLoginStatus:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 422
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         example: "UserLoginID"
 *                       location:
 *                         type: string
 *                         example: "body"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
