function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

console.log("Pre content script")

var query_string = window.location.search.substring(1);
query_string = query_string.replace(/;/g, '&');
var parsed_qs = parse_query_string(query_string);
console.log('To examine ',query_string);
var checkout_month = parsed_qs.checkin_month;
var checkout_monthday = parsed_qs.checkout_monthday;
var checkout_year = parsed_qs.checkout_year;

checkout = checkout_year + '-' + checkout_month + '-' + checkout_monthday;

///////

var group_adults = parsed_qs.group_adults
var group_children = parsed_qs.group_children
var no_rooms = parsed_qs.no_rooms

////////

var checkin_month = parsed_qs.checkin_month
var checkin_monthday = parsed_qs.checkin_monthday
var checkin_year = parsed_qs.checkin_year

checkin = checkin_year + '-' + checkin_month + '-' + checkin_monthday;

///////

console.log('Content from BG.')


// var url_string = window.location.href;
// var newUrlString = url_string.replace(/;/g, '&');
// var url = new URL(newUrlString);


// var checkout_month = url.searchParams.get("checkout_month");
// var checkout_monthday = url.searchParams.get("checkout_monthday");
// var checkout_year = url.searchParams.get("checkout_year");

// checkout = checkout_year + '-' + checkout_month + '-' + checkout_monthday;
// ////////

// var group_adults = url.searchParams.get("group_adults");
// var group_children = url.searchParams.get("group_children");
// var no_rooms = url.searchParams.get("no_rooms");

// var checkin_month = url.searchParams.get("checkin_month");
// var checkin_monthday = url.searchParams.get("checkin_monthday");
// var checkin_year = url.searchParams.get("checkin_year");

// checkin = checkin_year + '-' + checkin_month + '-' + checkin_monthday;
//////////



////////
currency = document.querySelector('input[name="selected_currency"]').value;

var data = {};
////////
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
    
}
if(no_rooms!== null){
    console.log(formatDate(checkin))
    console.log(formatDate(checkout))
    console.log(group_adults)
    console.log(group_children)
    console.log(no_rooms)

    
}


// By this line of code, we should have Object that contains data that will be sent into API later

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

/*  ----------------------------------  ---------------------------------- */

var Base64 = {
 

  // private property

  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",


  // public method for encoding

  encode : function (input) {

      var output = "";

      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;

      var i = 0;


      input = Base64._utf8_encode(input);


      while (i < input.length) {


          chr1 = input.charCodeAt(i++);

          chr2 = input.charCodeAt(i++);

          chr3 = input.charCodeAt(i++);


          enc1 = chr1 >> 2;

          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);

          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);

          enc4 = chr3 & 63;


          if (isNaN(chr2)) {

              enc3 = enc4 = 64;

          } else if (isNaN(chr3)) {

              enc4 = 64;

          }


          output = output +

          this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +

          this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);


      }


      return output;

  },


  // public method for decoding

  decode : function (input) {

      var output = "";

      var chr1, chr2, chr3;

      var enc1, enc2, enc3, enc4;

      var i = 0;


      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");


      while (i < input.length) {


          enc1 = this._keyStr.indexOf(input.charAt(i++));

          enc2 = this._keyStr.indexOf(input.charAt(i++));

          enc3 = this._keyStr.indexOf(input.charAt(i++));

          enc4 = this._keyStr.indexOf(input.charAt(i++));


          chr1 = (enc1 << 2) | (enc2 >> 4);

          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);

          chr3 = ((enc3 & 3) << 6) | enc4;


          output = output + String.fromCharCode(chr1);


          if (enc3 != 64) {

              output = output + String.fromCharCode(chr2);

          }

          if (enc4 != 64) {

              output = output + String.fromCharCode(chr3);

          }


      }


      output = Base64._utf8_decode(output);


      return output;


  },


  // private method for UTF-8 encoding

  _utf8_encode : function (string) {

      string = string.replace(/\r\n/g,"\n");

      var utftext = "";


      for (var n = 0; n < string.length; n++) {


          var c = string.charCodeAt(n);


          if (c < 128) {

              utftext += String.fromCharCode(c);

          }

          else if((c > 127) && (c < 2048)) {

              utftext += String.fromCharCode((c >> 6) | 192);

              utftext += String.fromCharCode((c & 63) | 128);

          }

          else {

              utftext += String.fromCharCode((c >> 12) | 224);

              utftext += String.fromCharCode(((c >> 6) & 63) | 128);

              utftext += String.fromCharCode((c & 63) | 128);

          }


      }


      return utftext;

  },


  // private method for UTF-8 decoding

  _utf8_decode : function (utftext) {

      var string = "";

      var i = 0;

      var c = c1 = c2 = 0;


      while ( i < utftext.length ) {


          c = utftext.charCodeAt(i);


          if (c < 128) {

              string += String.fromCharCode(c);

              i++;

          }

          else if((c > 191) && (c < 224)) {

              c2 = utftext.charCodeAt(i+1);

              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));

              i += 2;

          }

          else {

              c2 = utftext.charCodeAt(i+1);

              c3 = utftext.charCodeAt(i+2);

              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));

              i += 3;

          }


      }


      return string;

  }

}

function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = Base64.encode(tok);
  return "Basic " + hash;
}

var auth = make_base_auth('1446','0eae4a4e-40d5-4de4-957c-670cb7904e2a');

console.log(auth)


var city_name = document.getElementsByClassName('sr_header')[0].innerText; 
city_name = city_name.substring(0, city_name.indexOf(':')); //Belgrade

var e = document.getElementsByClassName('sr-hotel__name'); // elements that hold the hotel name

var arr = [...e] // convert HTMLOBJECT into array

console.log("The length of array is: ", arr.length)

var nRequest = [];
var nResult = [];
var nResult2 = []; // Is an array that holds the Index, HtmlTitleElement 
for (var i = 0; i < arr.length - 1; i++) {

    title_element = arr[i]; // the title as a element
    title_text = title_element.innerText; // the title as a text
    (function (i, title_element, title_text) {

        URL = 'https://partner.ostrovok.ru/api/b2b/v2/multicomplete?data={"query":"' + encodeURIComponent(title_text) + '","format":"json","lang":"en"}';

        console.log(URL)

        nRequest[i] = new XMLHttpRequest();
        //AUTH 
        var auth = make_base_auth('1446', '0eae4a4e-40d5-4de4-957c-670cb7904e2a');

        nRequest[i].open("GET", URL, true);
        // Headers - Authentification
        nRequest[i].setRequestHeader('Authorization', auth);
        nRequest[i].withCredentials = true;


        nRequest[i].onreadystatechange = function (oEvent) {
            if (nRequest[i].readyState === 4) {
                if (nRequest[i].status === 200) {

                    res_as_json = JSON.parse(nRequest[i].responseText);


                    /* NOTE NOTE NOTE there can be more then one return result per response
                      for example, if i search "Hotel Slavonija London", there might be 3 of them as a response 
                      and in this example below, I am getting only the first element in a return list        */

                    potential_hotel = res_as_json["result"]["hotels"]; // Object of a hotel  
                    // console.log(res_as_json["result"]["hotels"])

                    if (potential_hotel[0]) {

                        // nResult2.push([i, potential_hotel])  // IMPOPRTANT DONT DELETE


                        // console.log(i, potential_hotel);

                        var count_list = [0, 0];
                        if(potential_hotel.length > 1) {
                            
                            potential_hotel.forEach((hotel_object,index)=>{
                                similarity_check = similarity(title_text, hotel_object['name']);
                                if(similarity_check !== 1){
                                    if(count_list[0]<similarity_check){
                                        
                                        count_list[0] = similarity_check;
                                        count_list[1] = index;
                                    }
                                    
                                }else{
                                    console.log('---------')
                                    console.log('Perfect match! The element is: ', i, res_as_json["result"]["hotels"][index])
                                    console.log('Out of posibles ', res_as_json["result"]["hotels"]);
                                    console.log('---------')
                                    return nResult2.push([i, res_as_json["result"]["hotels"][index]])
                                }

                            })
                            
                        }else if(potential_hotel.length === 1){
                            console.log('---------')
                            console.log('There is only one item to compare. Must match. The element is',i, res_as_json["result"]["hotels"][0])
                            console.log('Out of posibles ', res_as_json["result"]["hotels"]);
                            console.log('---------')
                            // return nResult2.push([i, res_as_json["result"]["hotels"][0]])
                            return nResult2.push([i, res_as_json["result"]["hotels"][0]])

                        }else if(potential_hotel.length < 1){
                            console.log("There is no hotel ID for this element.")
                            
                        }
                    }


                } else {
                    console.log("Error", nRequest[i].statusText);
                }
            }
        };

        nRequest[i].send(null);

    })(i, title_element, title_text);
}

function processQ() {

    nResult2.push = Array.prototype.push;
    // ... this will be called on each .push
    len = nResult2.length;
    var refreshIntervalId = setInterval(fname, 2000);

    function fname() {
        if (nResult2.length !== len) {

            
            len = nResult2.length;

        } else {
            /* From here, i am sending starting and ending index of the list */

            /* that means that I am sending another request to API to get the hotels prices */

            console.log('This is the end', len, nResult2.length)
            slicenRequest2Array(1, nResult2.length);
            clearInterval(refreshIntervalId)
        }

    }
}


function slicenRequest2Array(start, end){
    the_string = ''
    /* Substracting 1, because lists starts from 0 */

    start_of_list = start - 1;
    end_of_list = end - 1;

    for(start_of_list; start_of_list < end_of_list; start_of_list++){
        // the_string = nResult2[start_of_list] + the_string
        console.log(nResult2[start_of_list][1]['id'])
        the_string = '"'+ nResult2[start_of_list][1]['id'] + '"' + the_string
    }

    
    var res = the_string.replace(/\"\"/g, "\",\"");
    

    /* By this point, I have a string ready to be inserted into hotel/rates API, with a key "ids" */
    /* "retenzija_apartment","boulevard_star_apartment","guest_house_vida","tas_hotel" */

    makeSecondAPIcall(res);
}

last_array = []
function makeSecondAPIcall(ids){

    (function(ids){

        URL = 'https://partner.ostrovok.ru/api/b2b/v2/hotel/rates?data={"ids":[' + ids + '],"checkin":"'+formatDate(checkin)+'","checkout":"'+formatDate(checkout)+'","adults":'+group_adults+',"children":'+group_children+',"lang":"en","format":"json","currency":"'+currency+'"}'

        console.log(URL)
        
        let xml = new XMLHttpRequest();
        //AUTH 
        var auth = make_base_auth('1446', '0eae4a4e-40d5-4de4-957c-670cb7904e2a');

        xml.open("GET", URL, true);
        // Headers - Authentification
        xml.setRequestHeader('Authorization', auth);
        xml.withCredentials = true;


        xml.onreadystatechange = function (oEvent){
            if (xml.readyState === 4) {
                if (xml.status === 200) {
                    // console.log(xml, ids)

                    result_to_json = JSON.parse(xml.response);

                    console.log(result_to_json)
                    logThePageConfiguration(result_to_json['debug']);
                    logTheListOfElements(result_to_json['result']['hotels'], result_to_json['debug']);
                }
            }
        }

        xml.send(null);
    })(ids);
    
}

function logTheListOfElements(list_of_hotels_objects, debug){
    html_index_and_object = []

    list_of_hotels_objects.forEach((elem)=>{
        for(var i = 0; i < nResult2.length-1; i++){
            if(elem['id'] === nResult2[i][1]['id']){
                // html_index_and_object.push([nResult2[i][0], elem])
                drawTheDivContainer(nResult2[i][0], elem, debug);
            }
        }
    });
    // console.log(html_index_and_object);
    
}

function drawTheDivContainer(html_index, the_object, debug){

    console.log('Creating div for ', html_index, the_object)
    /* This is the main wrapper that wrapps the whole ad */
    e = document.getElementsByClassName('sr-hotel__name')[html_index];
    main_wrapper = e.offsetParent.offsetParent.offsetParent.offsetParent;
    main_wrapper.setAttribute('style', 'position: relative');
    

    div = document.createElement('DIV');
    div.setAttribute('style', 'position: absolute;bottom: 0;left:0; z-index: 999;' )
    div.innerHTML = `<div class='--main-wrapper'>

                     </div>`;                     
    main_wrapper.appendChild(div);

    /* add insides to hotel id */
    p = document.createElement('P');
    p.innerText = the_object['id'];
    div.appendChild(p);

    p = document.createElement('P');
    p.innerText = the_object['rates'][0]['b2b_recommended_price'];
    div.appendChild(p);

    p = document.createElement('P');
    p.innerText = currency;
    div.appendChild(p);

    p = document.createElement('BUTTON');
    p.innerText = "ORDER";
    div.appendChild(p);
    
    p.addEventListener('click', (click_event)=>{
        the_object.debugg = debug;
        console.log("The important object", the_object)
        chrome.runtime.sendMessage({
            greeting1: the_object
        }, function (response) {
            console.log(response.farewell);
        });
    });
 
}



function logThePageConfiguration(thing){
    console.log('--------------------------*****')
    console.log('--------------------------*****')
    console.log('---------CONFIG-----------*****')
    console.log('--------------------------*****')
    console.log('--------------------------*****')
    console.log(thing)
}

nResult2.push = function () {
    Array.prototype.push.apply(this, arguments);
    processQ();
};