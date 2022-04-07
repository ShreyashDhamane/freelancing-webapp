require("dotenv/config");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log("connected");
  }
);
const userSignUpSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  userDataTaken: {
    type: Boolean,
    default: false,
  },
});

userSignUpSchema.pre("save", function (next) {
  const user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(saltRounds, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

const UserSignUp = mongoose.model("UserSignUp", userSignUpSchema);

var createNewUser = async (data) => {
  let username = data.username;
  let userExistWithUsername = await doesUsernameExist(username);
  if (userExistWithUsername === 1) {
    if (data.password === "") {
      return 3;
    }
    return 1;
  }
  const newUser = new UserSignUp({
    username: data.username,
    password: data.password,
  });
  try {
    newUser.save();
    return 4;
  } catch (error) {
    console.log(error);
  }
  return 0;
};

const doesUsernameExist = async (username) => {
  let result;
  try {
    const users = await UserSignUp.find({ username: username });
    if (users.length == 0) {
      result = 2;
    } else {
      result = 1;
    }
  } catch (error) {
    console.log(error);
  }
  return result;
};

const UserSignUpFindData = async (username, passwordEnteredByUser) => {
  let result;
  let data = await UserSignUp.find({ username: username });

  //we can make all the mongoose functions wait using await as below and dont have to worry about callback,
  //bcrypt.compare(passwordEnteredByUser, hash, function(err, isMatch) {
  //   if (err) {
  //     throw err
  //   } else if (!isMatch) {
  //     console.log("Password doesn't match!")
  //   } else {
  //     console.log("Password matches!")
  //   }
  // })
  //this will get cahgned to as below,
  // const match = await bcrypt.compare(passwordEnteredByUser, hashedPasswordFromDB);

  if (data.length === 0) {
    return 2;
  }

  const hashedPasswordFromDB = data[0].password;
  const match = await bcrypt.compare(
    passwordEnteredByUser,
    hashedPasswordFromDB
  );
  if (data.length === 0) result = 2;
  else result = match ? 6 : 5;
  return result;
};

const isValidUser = async (user) => {
  let result;
  let { username, password } = user;
  result = await UserSignUpFindData(username, password);
  let userDataTaken = false;
  if (result === 6) {
    const data = await UserSignUp.find({ username: username });
    userDataTaken = data[0].userDataTaken;
  }
  return { result: result, userDataTaken: userDataTaken };
};

const updateUserDataTaken = async (username, is) => {
  const filter = { username: username };
  const update = { userDataTaken: is };
  console.log(filter);
  console.log(update);
  // `doc` is the document _before_ `update` was applied
  await UserSignUp.findOneAndUpdate(filter, update);
};

module.exports = {
  createNewUser,
  isValidUser,
  UserSignUp,
  updateUserDataTaken,
};

//0 something wrong with database
//1 user exist with username
//2 user doesnt exist with username
//3 user exist with username and google SIGN UP trying,
//do login directly for him,
//4 user didnt exist created succesfully new user
//5 username matched but not password
//6 username and password matched
//7 username exist have to check if password matches or not
