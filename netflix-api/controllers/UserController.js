const User = require("../models/UserModel");

module.exports.addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const { likedMovies } = user;
      const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);

      if (!movieAlreadyLiked) {
        const updatedLikedMovies = [...likedMovies, data];
        await User.findByIdAndUpdate(
          user._id,
          {
            likedMovies: updatedLikedMovies,
          },
          { new: true }
        );
        return res.json({ msg: "Movie added successfully", movies: updatedLikedMovies });
      } else {
        return res.json({ msg: "Movie already added to the liked list." });
      }
    } else {
      await User.create({ email, likedMovies: [data] });
      return res.json({ msg: "Movie added successfully", movies: [data] });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error adding movie" });
  }
};

module.exports.getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ msg: "success", movies: user.likedMovies });
    } else {
      return res.status(404).json({ msg: "User with given email not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error fetching movie" });
  }
};

module.exports.removeFromLikedMovies = async (req, res) => {
  try {
    const { email, movieId } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const { likedMovies } = user;
      const movieIndex = likedMovies.findIndex(({ id }) => id === movieId);
      if (movieIndex === -1) {
        return res.status(400).json({ msg: "Movie not found" });
      }
      likedMovies.splice(movieIndex, 1);
      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies,
        },
        { new: true }
      );
      return res.json({ msg: "Movie Deleted", movies: likedMovies });
    } else {
      return res.status(404).json({ msg: "User with given email not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error deleting movie" });
  }
};