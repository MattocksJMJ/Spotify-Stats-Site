// Call back JS

window.onload = function() {
    loggedIn();
}

let songsArr = [];
let artistsArr = [];
let artistsTop = [];
let re = /access_token=(.*)&token/g;
let accessToken = (re.exec(window.location.hash.substring(1)))[1];

function loggedIn() {
    setTimeout(4000);
   if (window.location == redirect_uri + '?error=access_denied') {
       $('#usernameBox').css({'font-size':'1em'});
       $('#usernameBox').html('Error logging in');
   }
   else {
       $('#usernameButton').css({'display':'none'});
       retrieveContent();
   }
}

function retrieveContent() {
    const table1 = document.getElementById('table1');
    const table2 = document.getElementById('table2');
    let time_rangeA = sessionStorage.getItem('time_rangeA');
    let time_rangeS = sessionStorage.getItem('time_rangeS');

    // Retrieve display name & id
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(response) {
            $('#usernameBox').val(response.display_name);
            sessionStorage.setItem('display_name', response.display_name);
            sessionStorage.setItem('id', response.id);
        }
    });
    // Retrieve top artists
    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/artists'
            + '?time_range=' + time_rangeA
            + '&limit=' + '10',
        headers:{
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(response) {
            for (let i=0, row; row = table1.rows[i]; i++) {
                for (let j = 0, col; col = row.cells[j]; j++) {
                    col.innerHTML = response.items[i].name;
                }
            }
            for (let i=0; i<10; i++) {
                // addtoArr(response.items[i].uri, i);
                artistsArr[i] = response.items[i].id;
            }
            sessionStorage.setItem('artistsArr', JSON.stringify(artistsArr));
        }
    });
    // Retrieve top songs
    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/tracks'
            + '?time_range=' + time_rangeS
            + '&limit=' + '10',
        headers:{
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(response) {
            for (let i=0, row; row = table2.rows[i]; i++) {
                for (let j = 0, col; col = row.cells[j]; j++) {
                    if (j ==0) {col.innerHTML = response.items[i].name;}
                    else {col.innerHTML = response.items[i].artists[0].name;}
                }
            }
            for (let i=0; i<10; i++) {
                // addtoArr(response.items[i].uri, i);
                songsArr[i] = response.items[i].uri;
            }
            sessionStorage.setItem('songsArr', JSON.stringify(songsArr));
        }
    });
}

// Create new playlist with top songs
function createNewPlaylistS() {
    let playlistName = window.prompt('Please enter a name for the playlist');
    let songsArr = JSON.parse(sessionStorage.getItem('songsArr'));
    let id = sessionStorage.getItem('id');

    $.ajax({
        url: 'https://api.spotify.com/v1/users/'
            + id + '/playlists',
        method: 'POST',
        headers:{
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({'name': playlistName}),
        success: function(response) {
            addSongs(response.id);
        }
    });

    function addSongs(playlistID){
        $.ajax({
            url: 'https://api.spotify.com/v1/playlists/'
                + playlistID + '/tracks?',
            method: 'POST',
            headers:{
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': ' application/json'
            },
            data: JSON.stringify({'uris': songsArr}),
            success(response){}
        });
    }
}

function createNewPlaylistA() {
    let playlistName = window.prompt('Please enter a name for the playlist');
    let artistsArr = JSON.parse(sessionStorage.getItem('artistsArr'));
    let id = sessionStorage.getItem('id');

    for (let i=0; i<10; i++) {
        $.ajax({
            url: 'https://api.spotify.com/v1/artists/'
                + artistsArr[i] + '/top-tracks?country=from_token',
            headers:{
                'Authorization': 'Bearer ' + accessToken
            },
            success(response){
                artistsTop[i] = response.tracks[0].uri;
            }
        });
    }

    $.ajax({
        url: 'https://api.spotify.com/v1/users/'
            + id + '/playlists',
        method: 'POST',
        headers:{
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({'name': playlistName}),
        success: function(response) {
            addSongs(response.id);
        }
    });

    function addSongs(playlistID){
        $.ajax({
            url: 'https://api.spotify.com/v1/playlists/'
                + playlistID + '/tracks?',
            method: 'POST',
            headers:{
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': ' application/json'
            },
            data: JSON.stringify({'uris': artistsTop}),
            success(response){}
        });
    }
}

// Dropdown changes
function artists1() {
    sessionStorage.setItem('time_rangeA', 'short_term');
    location.reload();
}
function artists2(){
    sessionStorage.setItem('time_rangeA', 'medium_term');
    location.reload();
}
function artists3(){
    sessionStorage.setItem('time_rangeA', 'long_term');
    location.reload();
}
function songs1(){
    sessionStorage.setItem('time_rangeS', 'short_term');
    location.reload();
}
function songs2(){
    sessionStorage.setItem('time_rangeS', 'medium_term');
    location.reload();
}
function songs3(){
    sessionStorage.setItem('time_rangeS', 'long_term');
    location.reload();
}



// When hover over artists image appears
// " " " songs album cover appears
