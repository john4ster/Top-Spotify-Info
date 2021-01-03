topTracksList = document.querySelector('.topTracksList');
topArtistsList = document.querySelector('.topArtistsList');
footer = document.querySelector("#footer");

document.querySelector('.loginButton').addEventListener('click', function showLoginPopup() {
  document.querySelector('.modalbg').style.display = 'flex';
});

//Authentication
(function() {

  var stateKey = 'spotify_auth_state';
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */
  function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  var params = getHashParams();

  var access_token = params.access_token,
      state = params.state;

  if (access_token && state === null) {
    alert('There was an error during the authentication');
  } else {
    localStorage.removeItem(stateKey);
    if (access_token) {
      //Hide the login button
      $('.loginButton').hide();
      //Change the footer's position so it's below the page content
      footer.style.marginTop = "-50px";

      //Make an ajax call to get the top tracks
      $.ajax({
          url: 'https://api.spotify.com/v1/me/top/tracks',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            //Add each top track to the list in the html
            for (let i = 0; i < 20; i++)
            {
              //Show album cover
              let albumCover = document.createElement('img');
              albumCover.className = "albumCover";
              albumCover.src = response.items[i].album.images[1].url;
              topTracksList.append(albumCover);
              //Show track title
              let trackTitle = document.createElement('h3');
              trackTitle.className = "trackTitle";
              trackTitle.innerHTML = response.items[i].name;
              topTracksList.append(trackTitle);
              //Show artists
              let artists = document.createElement('p');
              artists.className = "artists";
              let artistList = response.items[i].artists;
              artists.innerHTML = artistList[0].name;
              topTracksList.append(artists);
            }
          }
      });
      //Make an ajax call to get the top artists
      $.ajax({
        url: 'https://api.spotify.com/v1/me/top/artists',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          //Add each top artist to the list in the html
          for (let i = 0; i < 20; i++)
          {
            //Show artist picture
            let artistPicture = document.createElement('img');
            artistPicture.className = "artistPicture";
            artistPicture.src = response.items[i].images[1].url;
            topArtistsList.append(artistPicture);
            //Show artist name
            let artistName = document.createElement('h3');
            artistName.className = "artistName";
            artistName.innerHTML = response.items[i].name;
            topArtistsList.append(artistName);
            //Show artist genres
            let artistGenre = document.createElement('p');
            artistGenre.className = "artistGenre";
            artistGenre.innerHTML = response.items[i].genres[0];
            topArtistsList.append(artistGenre);
          }
        }
      });
    } 
    else 
    {
        $('.loginButton').show();
    }

    document.querySelector('.modalLoginButton').addEventListener('click', function() {

      var client_id = '34d13c8215a84491ab353d9d4366d521'; // Your client id
      var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

      var state = generateRandomString(16);

      localStorage.setItem(stateKey, state);
      var scope = 'user-read-private user-read-email user-top-read';

      var url = 'https://accounts.spotify.com/authorize';
      url += '?response_type=token';
      url += '&client_id=' + encodeURIComponent(client_id);
      url += '&scope=' + encodeURIComponent(scope);
      url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
      url += '&state=' + encodeURIComponent(state);

      window.location = url;
    }, false);
  }
})();