const { messaging } = require("firebase-admin");
const Favorite = require("./favorite.model");

const getFavorites = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId parameter" });
  }

  try {
    const favorites = await Favorite.find({ userId }).populate("itemId");
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

const addFavorite = async (req, res) => {
  console.log("Request body received:", req.body);
  const { userId, itemId } = req.body;

  if (!userId || !itemId) {
    return res
      .status(400)
      .json({ error: "Missing userId or itemId in request body" });
  }

  try {
    const existingFavorite = await Favorite.findOne({ userId, itemId });
    if (existingFavorite) {
      return res.status(400).json({ message: "Item already in favorites" });
    }

    const favorite = new Favorite({ userId, itemId });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Failed to add favorite" });
  }
};

const removeFavorite = async (req, res) => {
  const { userId, itemId } = req.body;

  if (!userId || !itemId) {
    return res.status(400).json({ error: "userId and itemId are required." });
  }

  try {
    console.log(`Removing favorite for user: ${userId}, item: ${itemId}`);
    const result = await Favorite.deleteOne({ userId, itemId }); 
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Favorite not found." });
    }
    res.status(200).json({ message: "Favorite removed successfully." });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Failed to remove favorite." });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
