const githubCtrl = (() => {
  // github info
  const client_id = '999c721bd39b9b37a160';
  const client_secret = 'a99251111d6763cabcf21425a2265b8a5d70f0c3';
  const url = 'https://api.github.com';
  const repo_count = 10;
  const repo_sort = 'created: asc';

  // public methods
  return {
    getUser: async userInput => {
      //fetch profile data from github api
      const profileReponse = await fetch(
        `${url}/users/${userInput}?client_id=${client_id}&client_secret=${url}`
      );
      //fetch profile repo from github api
      const repoReponse = await fetch(
        `${url}/users/${userInput}/repos?per_page=${repo_count}&sort=${repo_sort}&client_id=${client_id}&client_secret=${url}`
      );

      //github data into json format
      const profileData = await profileReponse.json();
      //github repo data into json format
      const repoData = await repoReponse.json();

      return {
        profile: profileData,
        repo: repoData
      };
    }
  };
})();

const uiCtrl = (() => {
  //ui selector object
  const uiSelector = {
    searchInput: '.search-input',
    sectionResults: '.section-results',
    repoSection: '.repo-section'
  };

  const result = document.querySelector(uiSelector.sectionResults);

  //public methods
  return {
    getSelector: () => {
      return uiSelector;
    },
    showProfile: data => {
      console.log(data);
      //clear section results every new search
      result.innerHTML = '';

      //profile output
      let output = `
      <div class="container">
        <div class="profile-content">
          <div class="profile-avatar">
            <img
              src="${data.avatar_url}"
              alt="profile image"
              class="profile-img"
            />
            <p class="profile-name">${data.name}</p>
            <a
              href="${data.url}"
              class="btn btn-primary"
              target="_blank"
              >View Profile</a
            >
          </div>
          <div class="profile-list">
            <ul class="profile-social">
              <li class="social-list">Followers: ${data.followers}</li>
              <li class="social-list">Following: ${data.following}</li>
              <li class="social-list">Public Repos: ${data.public_repos}</li>
              <li class="social-list">Public Gists: ${data.public_gists}</li>
            </ul>
            <ul class="profile-info">
              <li>Bio: <em>${data.bio}</em></li>
              <li>Company: <em>${data.company}</em></li>
              <li>Location: <em>${data.location}</em></li>
              <li>Blog: <em>${data.blog}</em></li>
              <li>Email: <em>${data.email}</em></li>
              <li>Created At: <em>${data.created_at}</em></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="container repo-section"></div>
      `;

      //insert into result section
      result.insertAdjacentHTML('beforeend', output);
    },
    showRepo: data => {
      const repoSection = document.querySelector(uiSelector.repoSection);
      let output = '';

      data.forEach(repo => {
        //repo output
        output += `
        <div class="repo-content">
            <div class="repo-project-info">
                <p class="repo-title">${repo.name}:</p>
                <p class="repo-desc">${repo.description}</p>
            </div>
            <ul class="repo-social">
                <li class="social-list">Watchers: ${repo.watchers_count}</li>
                <li class="social-list">Stars: ${repo.stargazers_count}</li>
                <li class="social-list">Forks: ${repo.forks_count}</li>
            </ul>
            <div class="view-project">
                <a
                href="${repo.url}"
                class="btn btn-secondary"
                target="_blank"
                >View Project</a
                >
            </div>
        </div>
        `;
      });

      //insert output to repo section
      repoSection.insertAdjacentHTML('beforeend', output);
    },

    showAlert: message => {
      // create a div
      const div = document.createElement('div');
      div.className = 'danger';
      div.appendChild(document.createTextNode(`User ${message}`));

      //insert before search input
      document
        .querySelector(uiSelector.searchInput)
        .insertAdjacentHTML('beforebegin', div);

      setTimeout(() => {
        if (div.className === 'danger') {
          div.classList.remove('danger');
        }
      }, 1500);
    }
  };
})();

const app = ((github, ui) => {
  const selector = ui.getSelector();

  const userSearch = e => {
    const userInput = e.target.value;
    if (userInput !== '') {
      //fetch profile data from github user input
      github.getUser(userInput).then(data => {
        if (data.profile.message === 'Not Found') {
          //Show alert
          ui.showAlert(data.profile.message);
        } else {
          //Show profile
          ui.showProfile(data.profile);
          //Show repo
          //   ui.showRepo(data.repo);
        }
      });
    }
  };
  //event listener for user input
  document
    .querySelector(selector.searchInput)
    .addEventListener('keyup', userSearch);

  //   const githubData = github.getUser(userInput);
})(githubCtrl, uiCtrl);
