//APIs
const API_KEY = "d950bd1f2af830cac1a3110a767bc10f";
const API_URL = "https://api.themoviedb.org/3/";

const urls = {
  DISCOVER: `${API_URL}discover/movie?api_key=${API_KEY}&page=1`,
  IMGPATH: "https://image.tmdb.org/t/p/w1280",
  SEARCHAPI: `${API_URL}search/movie?api_key=${API_KEY}&query=`,
  NOWPLAYING: `${API_URL}movie/now_playing?language=en-US&api_key=${API_KEY}&page=1`,
  POPULAR: `${API_URL}movie/popular?language=en-US&api_key=${API_KEY}&page=1`,
  TOPRATED: `${API_URL}movie/top_rated?language=en-US&api_key=${API_KEY}&page=1`,
  UPCOMING: `${API_URL}movie/upcoming?language=en-US&api_key=${API_KEY}&page=1`
};

const { DISCOVER, IMGPATH, SEARCHAPI, NOWPLAYING, POPULAR, TOPRATED, UPCOMING } = urls;

//HTML elements
const getElementById = (id) => document.getElementById(id);
const [
  title,
  main,
  form,
  search,
  home,
  dropdown,
  dropbtn,
  dropdownContent,
  nowPlaying,
  topRated,
  popular,
  upcoming,
  prev,
  current,
  next
] = [
  "title",
  "main",
  "form",
  "search",
  "home",
  "dropdown",
  "dropbtn",
  "dropdown-content",
  "now-playing",
  "top-rated",
  "popular",
  "upcoming",
  "prev",
  "current",
  "next"
].map(getElementById);

//Event Listeners
home.addEventListener("click", () => {
  getMovies(DISCOVER);
  changeToHome();
  scrollToTop();
});

title.addEventListener("click", () => {
  getMovies(DISCOVER);
  changeToHome();
  scrollToTop();
});

nowPlaying.addEventListener("click", () => {
  getMovies(NOWPLAYING);
  changeToNowPlaying();
  scrollToTop();
});

popular.addEventListener("click", () => {
  getMovies(POPULAR);
  changeToPopular();
  scrollToTop();
});

topRated.addEventListener("click", () => {
  getMovies(TOPRATED);
  changeToTopRated();
  scrollToTop();
});

upcoming.addEventListener("click", () => {
  getMovies(UPCOMING);
  changeToUpcoming();
  scrollToTop();
});

dropdown.addEventListener("mouseover", displayDropdown);
dropdown.addEventListener("mouseout", hideDropdown);
prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
    scrollToTop();
  }
});
next.addEventListener("click", () => {
  if (NextPage <= totalpages) {
    pageCall(NextPage);
    scrollToTop();
  }
});

//Variables
let currentPage = 1;
let NextPage = 2;
let prevPage = 3;
let lastUrl = "";
let totalpages = 100;

//Functions
function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}
function displayDropdown() {
  dropdownContent.style.display = "block";
}
function hideDropdown() {
  dropdownContent.style.display = "none";
}
function changeToHome() {
  dropbtn.innerText = "Category";
}
function changeToNowPlaying() {
  dropbtn.innerText = "Now Playing";
  dropdownContent.style.display = "none";
}
function changeToPopular() {
  dropbtn.innerText = "Popular";
  dropdownContent.style.display = "none";
}
function changeToTopRated() {
  dropbtn.innerText = "TopRated";
  dropdownContent.style.display = "none";
}
function changeToUpcoming() {
  dropbtn.innerText = "Upcoming";
  dropdownContent.style.display = "none";
}

getMovies(DISCOVER);

async function getMovies(url) {
  lastUrl = url;
  const resp = await fetch(url);
  const respData = await resp.json();
  if (respData.length !== 0) {
    showMovies(respData.results);
    if (main.innerHTML == "") {
      noResultsFound();
      return;
    }
    prev.style.display = "block";
    current.style.display = "block";
    next.style.display = "block";
    currentPage = respData.page;
    NextPage = currentPage + 1;
    prevPage = currentPage - 1;
    totalpages = respData.total_pages;
    current.innerText = currentPage;
    if (currentPage <= 1) {
      prev.classList.add("disabled");
      next.classList.remove("disabled");
    } else if (currentPage >= totalpages) {
      prev.classList.remove("disabled");
      next.classList.add("disabled");
    } else {
      prev.classList.remove("disabled");
      next.classList.remove("disabled");
    }

  }
}

function showMovies(movies) {
  // Clear main
  main.innerHTML = "";

  movies.forEach((movie) => {
    const { poster_path, title, vote_average, overview } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
            <img
                src="${IMGPATH + poster_path}"
                alt="${title}"
            />
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(
      vote_average
    )}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                ${overview}
            </div>
        `;

    main.appendChild(movieEl);
  });
}

//Color according to the movie rating
function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  if (searchTerm) {
    getMovies(SEARCHAPI + searchTerm);
  }
});

//Prev and Next page movies
function pageCall(page) {
  let urlsplit = lastUrl.split("?");
  let queryParams = urlsplit[1].split("&");
  let key = queryParams[queryParams.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlsplit[0] + "?" + b;
    getMovies(url);
  }
}

//When no movies found
function noResultsFound() {
  main.innerHTML = "No movies found :(";
  main.style.cssText = "padding-top:5rem; color:#eee;"
  prev.style.display = "none";
  current.style.display = "none";
  next.style.display = "none";
}