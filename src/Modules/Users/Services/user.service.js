import { User } from "../../../DB/Models/user.model.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const emailexist = await User.findOne({ where: { email: email } });

    if (emailexist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.build({ name, email, password: hashedPassword, role });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: {
        name: error.name,
        message: error.message,
        details: error.errors,
      },
    });
  }
}


export const createOrUpdate = async (req, res) => {
  try {
    const userData = req.body;
    const userId = req.params.id;

    const userFields = Object.keys(User.getAttributes());
    const filteredData = Object.fromEntries(
      Object.entries(userData).filter(
        ([key]) => userFields.includes(key) && key !== "id"
      )
    );

    if (filteredData.password) {
      filteredData.password = await bcrypt.hash(filteredData.password, 10);
    }

    const [instance, created] = await User.upsert(
      { id: userId, ...filteredData },
      {
        conflictFields: ["id"],
        validate: true,
        returning: true,
      }
    );

    return res.status(created ? 201 : 200).json({
      success: true,
      message: created
        ? "User created successfully"
        : "User updated successfully",
      data: instance,
    });
  } catch (error) {
    console.error("Error in createOrUpdate proccess:", error);

    if (error?.parent?.errno == 1364) {
      return res.status(400).json({
        success: false,
        message: "all user attributes needed",
        error: {
          name: error.name,
          message: error.message,
          details: error.errors,
        },
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: {
        name: error.name,
        message: error.message,
        details: error.errors,
      },
    });
  }
};

export const findByEmail = async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required for searching",
        data: "none",
      });
    }
    const userFound = await User.findOne({ where: { email } });

    if (!userFound) {
      return res.status(404).json({
        success: false,
        message: "User was not found ",
        data: "none",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found successfully",
      data: { userFound },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: {
        name: error.name,
        message: error.message,
        details: error.errors,
      },
    });
  }
};

export const findByPk = async (req, res) => {
  try {
    const userId = req.params.id;

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid integer user ID required for searching",
        data: "none",
      });
    }
    const userFound = await User.findByPk(userId, {
      attributes: { exclude: ["role"] },
    });

    if (!userFound) {
      return res.status(404).json({
        success: false,
        message: "User was not found ",
        data: "none",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found successfully",
      data: { userFound },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: {
        name: error.name,
        message: error.message,
        details: error.errors,
      },
    });
  }
};
