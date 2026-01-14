/**************************************************
 * Import required packages
 **************************************************/
const mongoose = require("mongoose");
require("dotenv").config();

/**************************************************
 * Connect to MongoDB Atlas using Mongoose
 **************************************************/
async function connectToDb() {
  const { MONGO_URI } = process.env;
  if (!MONGO_URI) {
    throw new Error(
      "Missing MONGO_URI. Create a .env file with MONGO_URI=<your mongodb connection string>."
    );
  }

  await mongoose.connect(MONGO_URI);
}

// Use data base named 'mangoose'
mongoose.set("dbName", "mangoose");

/**************************************************
 * Create Person Schema
 * - name is required
 * - age is a Number
 * - favoriteFoods is an array of Strings
 **************************************************/
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // name is mandatory
  },
  age: Number,
  favoriteFoods: [String],
});

/**************************************************
 * Create Person Model
 **************************************************/
const Person = mongoose.model("Person", personSchema);

/**************************************************
 * Run all demo operations (modern Mongoose)
 **************************************************/
async function main() {
  await connectToDb();

  try {
    /**************************************************
     * Create and Save a Single Person
     **************************************************/
    const person = new Person({
      name: "John Doe",
      age: 25,
      favoriteFoods: ["pizza", "pasta"],
    });

    const savedPerson = await person.save();
    console.log("Person saved:\n", savedPerson);

/**************************************************
 * Create Many Records using Model.create()
 **************************************************/
    /**************************************************
     * Create Many Records using Model.create()
     **************************************************/
    const arrayOfPeople = [
      { name: "Mary", age: 22, favoriteFoods: ["burritos", "salad"] },
      { name: "Ali", age: 30, favoriteFoods: ["couscous", "burritos"] },
      { name: "Sarah", age: 19, favoriteFoods: ["pizza"] },
      { name: "Mary", age: 28, favoriteFoods: ["burritos", "salad"] },
      { name: "David", age: 35, favoriteFoods: ["burritos", "ramen"] },
      { name: "Emma", age: 27, favoriteFoods: ["burritos", "salad"] },
      { name: "Michael", age: 40, favoriteFoods: ["burger", "fries"] },
      { name: "Sophia", age: 23, favoriteFoods: ["salad", "burritos"] },
      { name: "James", age: 31, favoriteFoods: ["burritos", "baked potato"] },
      { name: "Olivia", age: 26, favoriteFoods: ["tacos", "guacamole"] },
      { name: "Liam", age: 29, favoriteFoods: ["fried chicken", "coleslaw"] },
    ];

    const createdPeople = await Person.create(arrayOfPeople);
    console.log("Multiple people added:\n", createdPeople);

/**************************************************
 * Find all people with a given name
 **************************************************/
    /**************************************************
     * Find all people with a given name
     **************************************************/
    const peopleNamedMary = await Person.find({ name: "Mary" });
    console.log("People named Mary:\n", peopleNamedMary);

/**************************************************
 * Find ONE person who likes a specific food
 **************************************************/
    /**************************************************
     * Find ONE person who likes a specific food
     **************************************************/
    const food = "burritos";
    const personWhoLikesBurritos = await Person.findOne({ favoriteFoods: food });
    console.log("Person who likes burritos:\n", personWhoLikesBurritos);


/**************************************************
 * Find a person by ID
 **************************************************/
    /**************************************************
     * Find a person by ID
     * Use the ID of the person we just saved.
     **************************************************/
    const personId = String(savedPerson._id);
    console.log("Using personId: ", personId);

    const foundById = await Person.findById(personId);
    console.log("Found by ID:\n", foundById);

/**************************************************
 * Classic Update: Find → Edit → Save
 * Add "hamburger" to favoriteFoods
 **************************************************/
    /**************************************************
     * Classic Update: Find → Edit → Save
     * Add "hamburger" to favoriteFoods
     **************************************************/
    const personToUpdate = await Person.findById(personId);
    if (!personToUpdate) {
      throw new Error(`Person not found for ID: ${personId}`);
    }

    personToUpdate.favoriteFoods.push("hamburger");
    const updatedPerson = await personToUpdate.save();
    console.log("Updated person:\n", updatedPerson);

/**************************************************
 * Update using findOneAndUpdate()
 * Set age to 20 and return updated document
 **************************************************/
    /**************************************************
     * Update using findOneAndUpdate()
     * Set age to 20 and return updated document
     **************************************************/
    const personName = "Ali";
    const ageUpdated = await Person.findOneAndUpdate(
      { name: personName },
      { age: 20 },
      { new: true }
    );
    console.log("Age updated:\n", ageUpdated);

/**************************************************
 * Delete ONE person by ID
 **************************************************/
    /**************************************************
     * Delete ONE person by ID
     **************************************************/
    const deletedPerson = await Person.findByIdAndDelete(personId);
    console.log("Deleted person:\n", deletedPerson);

/**************************************************
 * Delete MANY people named "Mary"
 **************************************************/
    /**************************************************
     * Delete MANY people named "Mary"
     **************************************************/
    const deleteResult = await Person.deleteMany({ name: "Mary" });
    console.log("Delete result:\n", deleteResult);

/**************************************************
 * Chain Search Query Helpers
 * - Find people who like burritos
 * - Sort by name
 * - Limit to 2 results
 * - Hide age field
 **************************************************/
    /**************************************************
     * Chain Search Query Helpers
     * - Find people who like burritos
     * - Sort by name
     * - Limit to 2 results
     * - Hide age field
     **************************************************/
    const chainedQueryResult = await Person.find({ favoriteFoods: "burritos" })
      .sort({ name: 1 })
      .limit(2)
      .select("-age")
      .exec();
    console.log("Chained query result:\n", chainedQueryResult);
  } finally {
    await mongoose.connection.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
