// Call back JS

window.onload = function() {
    loggedIn();
}

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
    let re = /access_token=(.*)&token/g;
    var accessToken = (re.exec(window.location.hash.substring(1)))[1];
    const table1 = document.getElementById('table1');
    const table2 = document.getElementById('table2');
    let time_rangeA = sessionStorage.getItem('time_rangeA');
    let time_rangeS = sessionStorage.getItem('time_rangeS');

    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(response) {
            // sort data into rows
            $('#usernameBox').val(response.display_name);
        }
    });
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
        }
    });
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
                    console.log();
                }
            }
        }
    })
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