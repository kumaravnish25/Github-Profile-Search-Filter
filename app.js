const searchInput = document.querySelector(".search__input");
const searchButton = document.querySelector(".search__button");
const mainSection = document.querySelector(".main__section");
const user = document.querySelector(".user");
const searchError = document.querySelector(".error");
const githubImage = document.querySelector(".github__image");
const userName = document.querySelector(".user__name");
const userName2 = document.querySelector(".user__name2");
const userBio = document.querySelector(".user__bio");
const userLocation = document.querySelector(".user__location");
const userWebsite = document.querySelector(".user__website");
const firstStatNumber = document.querySelector(".firstStatNumber");
const firstStatTitle = document.querySelector(".firstStatTitle");
const secondStatNumber = document.querySelector(".secondStatNumber");
const secondStatTitle = document.querySelector(".secondStatTitle");
const thirdStatNumber = document.querySelector(".thirdStatNumber");
const thirdStatTitle = document.querySelector(".thirdStatTitle");
const userRepositories = document.querySelector(".user__repositories");
const userFollowers = document.querySelector(".user__followers");
const header = document.querySelector(".header");
const loader = document.querySelector(".loader");
const pageBox =document.getElementById('box')

const fetchUserData = async (userName) => {
  try {
    const response = await fetch(`https://api.github.com/users/${userName}`);
    const data = await response.json();

    if (data.login !== undefined) {
      renderProfile(data);
      // renderUserRepositories(userName);
    } else {
      userNotFound();
    }
  } catch (error) {
    console.log(error);
  }
};

const renderProfile = (userData) => {
  loader.style.display='none';
  user.style.display = "flex";
  searchError.style.display = "none";
  githubImage.src = userData.avatar_url;
  userName.textContent = userData.name;
  userBio.textContent = userData.bio;

  userLocation.innerHTML = `
        <i class="fa-solid fa-location-dot"></i>
        <p>${userData.location}</p>
    `;

  userWebsite.innerHTML = `
        <i class="fa-solid fa-link"></i>
		<a href="${userData.html_url}" class="website__link" target="_blank">${userData.html_url} </a>
    `;

  firstStatTitle.textContent = "Followers";
  firstStatNumber.textContent = userData.followers;
  secondStatTitle.textContent = "Following";
  secondStatNumber.textContent = userData.following;
  thirdStatTitle.textContent = "Repositories";
  thirdStatNumber.textContent = userData.public_repos;
  rep_num = userData.public_repos;
  console.log(rep_num);

  let ul = document.querySelector(".ul");
  let prev = document.querySelector(".prev");
  let next = document.querySelector(".next");

  let currentpage = 1;
  let totalpage = Math.ceil(rep_num / 10);
  let active_page = "";

  create_page(currentpage);

  function create_page(currentpage) {
    ul.innerHTML = "";

    for (let i = 1; i <= totalpage && i <= currentpage + totalpage; i++) {
      if (currentpage == i) {
        active_page = "active_page";
      } else {
        active_page = "";
      }
      ul.innerHTML += `<li> <a href="#" class="page_number ${active_page}">${i}</a> </li>`;
    }
  }
  pageBox.style.display='block';
  displayRepositories(searchInput.value, 1);
  ul.addEventListener("click", function (event) {
    if (event.target.classList.contains("page_number")) {
      currentpage = parseInt(event.target.innerText);
      create_page(currentpage);
      displayRepositories(searchInput.value, currentpage);
    }
  });

  prev.addEventListener("click", function () {
    if (currentpage > 1) {
      currentpage--;
      create_page(currentpage);
      displayRepositories(searchInput.value, currentpage);
    }
  });

  next.addEventListener("click", function () {
    if (currentpage < totalpage) {
      currentpage++;
      create_page(currentpage);
      displayRepositories(searchInput.value, currentpage);
    }
  });


  const pageNumbers = document.querySelectorAll(".page_number");
  if (pageNumbers.length > 0) {
    pageNumbers.forEach((page) => {
      page.addEventListener("click", () => {
        // Handle pagination click
        console.log("Page clicked:", page.textContent);
      });
    });
  }
};

async function displayRepositories(username, page) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?page=${page}&per_page=10`
    );
    const repositories = await response.json();
    let HTMLContentToAppend = "";

    for (const repository of repositories) {
      HTMLContentToAppend += `
                <div class="repository">
                    <a href="${
                      repository.html_url
                    }" class="repository__name" target="_blank">${
        repository.name
      }</a>
                    <p class="repository__description">${
                      repository.description
                    }</p>
                    <div class="repository__info">
                        <p class="repository__languages">${
                          repository.language
                        }</p>
                        <p class="repository__lastUpdate">Last Update: ${String(
                          repository.updated_at
                        ).substring(0, 10)}</p>
                    </div>
                </div>
            `;
    }

    userRepositories.innerHTML = `
            ${HTMLContentToAppend}
        `;
  } catch (error) {
    console.log(error);
  }
}

const userNotFound = () => {
  user.style.display = "none";
  searchError.style.display = "block";
  userRepositories.innerHTML = "";
  userFollowers.innerHTML = "";
};

// Event Listeners
searchButton.addEventListener("click", async () => {
  fetchUserData(searchInput.value);
  header.style.display = "none";
  loader.style.display='block'
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    fetchUserData(searchInput.value);
    header.style.display = "none";
    loader.style.display='block'
  }
});
