let message = [];
let updating = false;

function display(price){
  price = price.toString();
  price = price.split('')
  price = price.reverse();
  let p_100 = 0;
  if(price[2]){
    p_100 = price[2];
  }
  let p_10 = 0;
  if(price[1]){
    p_10 = price[1];
  }
  let p_1 = price[0];
  let f = 30;
  $('.n-100').animate({'margin-top': p_100 * -f});
  $('.n-10').animate({'margin-top': p_10 * -f});
  $('.n-1').animate({'margin-top': p_1 * -f});
}


function update(){
  if(updating){
    return;
  }
  updating = true;
  let phone = $('.phone>input:checked').val();
  let whatPhone = $('.phone>input:checked').parent().find('h2').text();
  phone = parseInt(phone);
  phone = phone? phone : 0;

  let contract = $('#contract>option:selected').val();
  let whatContract = $('#contract>option:selected').text();
  contract = parseInt(contract);
  contract = contract? contract : 0;

  let data = $('.data>input:checked').val();
  let whatData = $('.data>input:checked').parent().find('label').text();
  data = parseInt(data);
  data = data? data : 0;

  let extra = 0;
  let whichExtras = [];
  $('.extra>input:checked').each(function(){
    let x = $(this).val();
    if(x > 0){
      extra += x;
      whichExtras.push(   $(this).parent().find('label').text()   );
    }
  });

  let price = phone + contract + data + extra;

  switch(whatPhone){
    case 'iPhone G':
      $('.extra *[value=30]').click();
      price = price - 30;
      message.push("Du får Airy Flayphones på köpet när du väljer iPhone G! ");
      if(whatContract == '12 mån Student'){
        price = price * 0.75;
        message.push("Du får 20% rabatt på totalsumman när du väljer iPhone G och 12 månader student! ");
      }
      break;
    case 'iPhone Z':
      if(whatContract == '18 mån Silver'){
        price = price * 0.9;
        message.push("Du får 10% rabatt på totalsumman när du väljer iPhone Z och 18 mån Silver! ");      }
      break;
    case 'Samsung Wear':
      $('.extra *[value=50]').click();
      price = price - 50;
      message.push("Du får Boomy bass box på köpet när du väljer Samsung Wear! ");
      break;
    case 'iDrink Nokia':
      $('.extra *[value=75]').click();
      price = price - 75;
      message.push("Du får Cloudy insurance på köpet när du väljer iDrink Nokia! ");
      if(whatContract == '18 mån Silver'){
        price = price * 0.8;
        message.push("Du får 20% rabatt på totalsumman när du väljer Samsung Wear och 18 mån Silver! ");
      }
      break;
  }

  if(whatContract == '24 mån Guld' && whatData == '100 GB'){
    price = price * 0.75;
    message.push("Du får 25% rabatt på totalsumman när du väljer 24 mån Guld och 100 GB Data! ");
  }

  $('#confirm').html('<li><h1>din beställning är mottagen!</h1></li>' + '<li>' + message.join('</li><li>') + '</li> <br><button id="return">Stäng</button>');
  $('#notice').html('<li>' + message.join('</li><li>') + '</li>');
  $('#notice').show(500).delay(1000).hide(500);

  $('#price').val(price);
  display(price);
  updating = false;
}

function getFormData(){
  let data = {};
  $('#order input, #order select').each(function(){
    let key = $(this).attr('name');
    if(key){
      key = key.replace(/\-/g, '_');
      data[key] = $(this).val();
    }
  });
  let when = '';
  let now = new Date();
  when +=now.getFullYear();
  when += '-' + now.getMonth();
  when += '-' + now.getDate();
  when += ' ' + now.getHours();
  when += ':' + now.getMinutes();
  data['order-placed'] = when;
  return data
}

$('body').on('change', '#contract', update);
$('body').on('click', '.phone, .contract, .data, .extra', update);

$(document).on('click', '#details>button', function(e){
  e.preventDefault();
  $('#details>input').toggle();
  $(this).toggleClass('showing-form');
});

$(document).on('submit','#order', async function(e){
  e.preventDefault();
  let formData = getFormData()
  $.ajax({
    url: 'api/orders/',
    type: "POST",
    dataType: 'json',
    data: JSON.stringify(formData),
    contentType: 'application/json;charset=UTF-8',
    success : function(result) {
      result = result[0];
      console.log(result);
      let text = '';
      for(let key in result){
        text += '<li>' + key + ': ' + result[key] + '</li>';
      }
      $('#confirm>li>h1').prepend( $('#first-name').val() + ' ' + $('#last-name').val() )
      $('#return').before( '<ul class="form-data"><li>' + text + '</li></ul>');
      $('#details>input').hide();
      $('#confirm').fadeIn(500);
    },
    error: function(xhr, resp, text) {
        console.log(xhr, resp, text);
    }
  })
});

$(document).on('click','#return', function(e){
  e.preventDefault();
  $('#details>input').show();
  $('.form-data').remove();
  $('#confirm').fadeOut(500);
});

