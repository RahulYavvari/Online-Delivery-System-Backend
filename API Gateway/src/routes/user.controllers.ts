import { NextFunction } from "express";

const express = require("express");
const router = express.Router();
const userServices = require("../services/user.services");
const Role = require("../helpers/role");
const jwt = require("../helpers/jwt");
//routes
router.post("/authenticate", authenticate);
router.post("/register", register);
router.get("/", jwt(Role.Admin), getAll);
router.get("/current", jwt(), getCurrent);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", _delete);

module.exports = router;

//route functions
function authenticate(req: any, res: any, next: NextFunction) {
  userServices
    .authenticate(req.body)
    .then((user: any) => {
      console.log(user);
      user
        ? res.json({ user: user, message: "User logged in successfully" })
        : res
            .status(400)
            .json({ message: "Username or password is incorrect." });
    })
    .catch((error: any) => next(error));
}

function register(req: any, res: any, next: NextFunction) {
  userServices
    .create(req.body)
    .then((user: any) =>
      res.json({
        user: user,
        message: `User Registered successfully with email ${req.body.email}`,
      })
    )
    .catch((error: any) => next(error));
}

function getAll(req: any, res: any, next: NextFunction) {
  const currentUser = req.user;

  if (currentUser.role !== Role.Admin) {
    return res.status(401).json({ message: "Not Authorized!" });
  }
  userServices
    .getAll()
    .then((users: any) => res.json(users))
    .catch((err: any) => next(err));
}

function getCurrent(req: any, res: any, next: NextFunction) {
  console.log(req);
  userServices
    .getById(req.user.sub)
    .then((user: any) => (user ? res.json(user) : res.status(404)))
    .catch((error: any) => next(error));
}

function getById(req: any, res: any, next: NextFunction) {
  userServices
    .getById(req.params.id)
    .then((user: any) => {
      if (!user) {
        res.status(404).json({ message: "User Not Found!" });
        next();
      }
      return res.json(user);
    })
    .catch((error: any) => next(error));
}

function update(req: any, res: any, next: NextFunction) {
  userServices
    .update(req.params.id, req.body)
    .then(() =>
      res.json({
        message: `User with id: ${req.params.id} updated successfully.`,
      })
    )
    .catch((error: any) => next(error));
}

function _delete(req: any, res: any, next: NextFunction) {
  userServices
    .delete(req.params.id)
    .then(() =>
      res.json({
        message: `User with id: ${req.params.id} deleted successfully.`,
      })
    )
    .catch((error: any) => next(error));
}