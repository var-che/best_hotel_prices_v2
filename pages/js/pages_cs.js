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


chrome.runtime.sendMessage({greeting: "yo"}, function(response) {
  if(response.fag) {
    console.log(response.fag) // rooms object w/id
    getBasicDetails(response.fag);
  }
});

function getBasicDetails(hotel_object){
  URL = 'https://partner.ostrovok.ru/api/b2b/v2/hotel/list?data={"ids":["' + hotel_object['id'] +'"],"lang":"en"}'
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

            //   console.log('Lol', result_to_json, hotel_object)
  
              changeHeaders(result_to_json['result'][0]);
              getRooms(hotel_object);
          }
      }
  }

  xml.send(null);
}

function changeHeaders(hotel_object){
  console.log('The main object', hotel_object)
  /* Change title of the hotel */
  hotel_title = document.getElementsByClassName('lh1em')[0];
  hotel_title.innerText = hotel_object['name'];

  /* Change the address of the hotel */
  hotel_address = document.getElementsByClassName('lh1em text-small')[0];
  hotel_address.innerText = hotel_object['address'];

  /* Change hotels e-mail */
  hotel_email = document.getElementsByClassName('list list-inline text-small')[0].children[0].children[0];
  hotel_email.href = hotel_object['email'];

  /* Change hotels webpage */
  hotel_email = document.getElementsByClassName('list list-inline text-small')[0].children[1].children[0];
  hotel_email.href = hotel_object['hotelpage'];
  
  /* Change the phone */
  hotel_phone = document.getElementsByClassName('list list-inline text-small')[0].children[2];
  hotel_phone.innerText = hotel_object['phone'];

  /* Insert pictures */
  hotel_pictures = document.getElementsByClassName('fotorama')[0];
  hotel_object['images'].forEach(element => {
    image = document.createElement('IMG');
    image.src = element.url;
    hotel_pictures.appendChild(image);
  });

  /* Hotel description - about hotel in short */
  hotel_description_short = document.getElementsByClassName('mb30')[0];
  hotel_description_short.innerText = hotel_object['description_short'];

  /* Total verbose: Good, bad, exceptional etc */
  hotel_verbose =  document.getElementsByClassName('lh1em mt40')[0];
  hotel_verbose.innerText = hotel_object['rating']['total_verbose'];

  /* Star ratings */
  hotel_star_ratings = document.getElementsByClassName('icon-list icon-group booking-item-rating-stars')[0];
  num_of_stars = hotel_object['rating']['total'];

  star_html_total = ''
  for(var i = 0; i < num_of_stars; i++){
      star_html = '<li><i class="fa fa-star"></i></li>';
      
      star_html_total = star_html + star_html_total;
  }

  hotel_star_ratings.innerHTML = star_html_total;

  /* Star rating in letters */
  rating_letters = document.getElementsByClassName('booking-item-rating-number')[0].children[0];
  rating_letters.innerText = num_of_stars;

  hotel_votes = document.getElementsByClassName('text-default')[0];
  num_of_votes = hotel_object['rating']['reviews_count'];
  hotel_votes.innerText = `based on ${num_of_votes} reviews!`;

  /* Smilies */
  hotel_detailed = hotel_object['rating']['detailed']
  hotel_smilies = document.getElementsByClassName('list booking-item-raiting-summary-list')[0];

  var iterator = 0;
  for(key in hotel_detailed){
    star_html_total = '';
    for(var i = 0; i< hotel_detailed[key]; i++){
        star_html = '<i class="fa fa-smile-o"></i>';

        star_html_total = star_html + star_html_total;
    }

    hotel_smilies.children[iterator].children[1].innerHTML = star_html_total;
    star_html_total = '';
    iterator++;
  }

  /* Amenities */
  amenities = document.getElementsByClassName('booking-item-features booking-item-features-expand mb30 clearfix')[0];
  hotel_object['amenities'].forEach((element) => {
    
    ameninties_description = '';
    element['amenities'].forEach((element)=>{
        ameninties_description = element + ', ' + ameninties_description;
    })
    list_element = document.createElement('LI');
    list_element.innerHTML = `<span class="booking-item-feature-title">${element['group_name']}</span>
    <p>${ameninties_description}</p>`;

    amenities.appendChild(list_element);
  })
}

function getRooms(the_object) {
    debug = the_object['debugg'];
    /* https://partner.ostrovok.ru/api/b2b/v2/hotelpage/britannia_hotel__manchester_city_centre
    ?data={"checkin":"2018-06-01","checkout":"2018-06-04","adults":2,"lang":"en","format":"json","currency":"usd"} */
    URL = `https://partner.ostrovok.ru/api/b2b/v2/hotelpage/${the_object.id}?data={"checkin":"${debug.checkin}","checkout":"${debug.checkout}","adults":${debug.adults},"lang":"${debug.lang}","format":"json","currency":"${debug.currency}"}`;
    console.log('The API request:  ', URL)
    let xml = new XMLHttpRequest();
    //AUTH 
    var auth = make_base_auth('1446', '0eae4a4e-40d5-4de4-957c-670cb7904e2a');

    xml.open("GET", URL, true);
    // Headers - Authentification
    xml.setRequestHeader('Authorization', auth);
    xml.withCredentials = true;


    xml.onreadystatechange = function (oEvent) {
        if (xml.readyState === 4) {
            if (xml.status === 200) {
                // console.log(xml, ids)

                result_to_json = JSON.parse(xml.response);

                // console.log(result_to_json['result']['hotels'][0])
                listTheRooms(result_to_json['result']['hotels'][0])

                
            }
        }
    }

    xml.send(null);
}

function listTheRooms(room_object){
    // console.log(room_object)
    /* List all in the rates from object */

    console.log('Example room for this hotel')
    rates = room_object['rates']
    console.log(rates)

    /* Change the main price */
    main_price = document.getElementsByClassName('text-lg')[0];
    main_price.innerText =  rates[0]['rate_currency'] + ' ' + rates[0]['daily_prices'][0];
    
    /* Create hotel items in body page */
    ul_hotel_items = document.getElementsByClassName('booking-list')[0];
    for(key in rates){
        

        meal = ''
        if(rates[key]['meal'] === 'nomeal'){
            meal = `The meal is not included within this price.`
        }else{
            meal = `${rates[key]['meal']} is included in this price.`
        }

        cancelation_fee_penalty = rates[key]['cancellation_info']['policies'][0]['penalty'];
        cancelation_fee_penalty = `If canceled, ${cancelation_fee_penalty['percent']} percent of the price will be charged.`  

        ul_string = `<a class="booking-item">
            <div class="row">
                <div class="col-md-3">
                    <img src="img/800x600.png" alt="Image Alternative text" />
                </div>
                <div class="col-md-6">
                    <h5 class="booking-item-title">${rates[key]['room_name']}</h5>
                    <ul class="fa-ul" style="margin-top: 30px;">      
                        <li><i class="fa-li fa fa-cutlery "></i>${meal}</li>
                        <li><i class="fa-li fa fa-credit-card "></i>${cancelation_fee_penalty}</li>                                
                    </ul>    
                </div>
                <div class="col-md-3"><span class="booking-item-price">${rates[key]['rate_price']}</span><span>${rates[key]['rate_currency']}/3 days</span><br><span class="btn btn-primary">Book</span>
                </div>
            </div>
        </a>`
        
        if(rates[key]['room_name']){
            lista = document.createElement('LI');
            lista.innerHTML = ul_string;
            ul_hotel_items.appendChild(lista);
        }
    }
}