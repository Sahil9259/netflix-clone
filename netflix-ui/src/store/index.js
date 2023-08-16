import {
    configureStore,
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
    movies: [],
    genresLoaded: false, 
    genres: [],
};

const API_KEY = process.env.REACT_APP_API_KEY;
const TMBD_BASE_URL = process.env.REACT_APP_TMBD_BASE_URL;
export const getGenres = createAsyncThunk("netflix/genres", async () => {
    const {
        data: { genres }
    } = await axios.get(
        `${TMBD_BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    // console.log(data);
    return genres;
});

const createArrayFromRawData = (array, moviesArray, genres) => {
    array.forEach((movie) => {
        const movieGenres = [];
        movie.genre_ids.forEach((genre) => {
            const name = genres.find(({ id }) => id === genre);
            if (name) movieGenres.push(name.name);
        });
        if (movie.backdrop_path) {
            moviesArray.push({
                id: movie.id,
                name: movie?.original_name ? movie.original_name : movie.original_title,
                image: movie.backdrop_path,
                genres: movieGenres.slice(0, 3),

            })
        }
    });
};

const getRawData = async (api, genres, paging = false) => {
    const moviesArray = [];
    for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
        const { data: { results } } = await axios.get(`${api}${paging ? `&page${i}` : ""}`
        );
        createArrayFromRawData(results, moviesArray, genres);
    }
    return moviesArray;
}

export const fetchMovies = createAsyncThunk(
    "netflix/trending",
    async ({ type }, thunkAPI) => {
        const { netflix: { genres },
        } = thunkAPI.getState();
        return getRawData(
            `${TMBD_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
            genres,
            true);
        // console.log(data);
    });
export const fetchDataByGenre = createAsyncThunk(
    "netflix/genre",
    async ({ genre, type }, thunkAPI) => {
        const { netflix: { genres },
        } = thunkAPI.getState();
        return getRawData(
            `${TMBD_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`,
            genres
        );
        // console.log(data);
    }
);
export const getUsersLikedMovies = createAsyncThunk(
    "netflix/getLiked",
    async (email) => {
        const {
            data: { movies },
        } = await axios.get(`https://netflix-8t4n.onrender.com/api/user/liked/${email}`);
        console.log(email);
        console.log(movies)
        return movies;
    }
);

export const removeFromLikedMovies = createAsyncThunk(
    "netflix/deleteLiked",
    async ({ email,movieId }) => {
        const {
            data: { movies },
        } = await axios.put(`https://netflix-8t4n.onrender.com/api/user/delete`, {
            email,
            movieId,
        });
        return movies;
    }
);
const NetflixSlice = createSlice({
    name: "Netflix",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getGenres.fulfilled, (state, action) => {
            state.genres = action.payload;
            state.genresLoaded = true;
        });
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            state.movies = action.payload;
        });
        builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
            state.movies = action.payload;
        });
        builder.addCase(getUsersLikedMovies.fulfilled, (state, action) => {
            state.movies = action.payload;
        });
        builder.addCase(removeFromLikedMovies.fulfilled, (state, action) => {
            state.movies = action.payload;
        });
    },
});
export const store = configureStore({
    reducer: {
      netflix: NetflixSlice.reducer,
    },
  });
  
export const { setGenres, setMovies } = NetflixSlice.actions;
