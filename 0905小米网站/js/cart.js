
(function () {
  'use strict';
  var products = [
    {
      id:1,
      image:'images/car11.png',
      name:'小米MAX 2',
      quantity:1,
      price:1599.00,
      key:'全面屏2.0',
      spec:''
    },
    {
      id:2,
      image:'images/car2.png',
      name:'小米Note 3',
      quantity:1,
      price:2499.00,
      key:'人脸解锁',
      spec:''
    },
    {
      id:3,
      image:'images/car3.png',
      name:'小米6',
      quantity:2,
      price:2499.00,
      key:'5.15" 护眼屏 ',
      spec:''
    },
    {
      id:4,
      image:'images/car4.jpg',
      name:'小米5X',
      quantity:1,
      price:1299.00,
      key:'变焦双摄',
      spec:''
    },
    {
      id:5,
      image:'images/car5.jpg',
      name:'小米笔记本Air 12.5"',
      quantity:1,
      price:3499.00,
      key:'13.3英寸',
      spec:''
    }
  ];
  function toCurrency(value) {
    return '$'+value.toFixed(2);
  }

  $(function () {
    var $tbody = $('#cart tbody');
    function prepareArray(array) {
      for(var i= 0, len = array.length; i < len ; i++){
        array[i].subTotal = array[i].price * array[i].quantity;
        array[i].fullName = array[i].name + ' ' + array[i].key;
      }
    }
    function createRows(array) {
      var html = '';
      var template = $('#tr-template').text();
      array.forEach(function (item,index) {
        html +=$.y.format(template,
          item.image,
          item.name + ' ' + item.key,
          item.spec,
          toCurrency(item.price),
          item.quantity,
          $.y.toCurrency(item.subTotal),
          item.id
        );
      });
      $tbody.html(html);
    }
    function updateFoot(array) {
      var total = $.y.sum(array,function (item,index) {
        return item.quantity;
      });
      var total1 = $.y.sum(array,function (item,index) {
        return item.subTotal;
      });
      $('tfoot tr td:nth-child(6)').text(total);
      $('tfoot tr td:nth-child(7)').text($.y.toCurrency(total1));
    }
    prepareArray(products);
    createRows(products);
    updateFoot(products);
    $('#cart th').slice(2,7).on('click',function () {
      var direction = 1;
      var $th = $(this);
      if($th.hasClass('sort-asc')){
        direction = -1;
      }
      $th.siblings().removeClass('sort-asc sort-desc');
      $th.removeClass('sort-asc sort-desc');
      if(direction==1){
        $th.addClass('sort-asc');
      }
      else{
        $th.addClass('sort-desc');
      }
      var key = $th.data('sort');
      products.sort(function (a, b) {
        if(a[key] < b[key]){
          return -direction;
        }
        if(a[key] > b[key]){
          return direction;
        }
        return 0;
      });
      createRows(products);
    });
    /*
     * 全选
     * */
    $('#all').on('click',function () {
      var selected = $(this).prop('checked');
      $('#cart input[name=productID]').each(function () {
        this.checked = selected;
      });
    });
    $tbody.on('click','input[type=checkbox]',function (event) {
      if(this.checked){
        if($('#cart input[name=productID]:checked').length==products.length){
          $('#all').prop('checked',true);
        }
      }
      else{
        $('#all').prop('checked',false);
      }
    });
    $tbody.on('click','tr button:nth-of-type(1)',function () {
      //console.log('button1');
      var $input = $(this).next();
      var num = $input.val();
      if(num > 1){
        $input.val(--num).trigger('change');
      }
    });
    $tbody.on('click','tr button:nth-of-type(2)',function () {
      var $input = $(this).prev();
      var num = $input.val();
      $input.val(++num).trigger('change');
    });

    $tbody.on('change','input[type=text]',function () {
      var $input = $(this);
      var quantity = Number(this.value);

      var id = $input.parent().parent().data('pid');
      var result = products.find(function (item,index) {
        return item.id == id;
      });
      result.quantity = quantity;
      result.subTotal =  result.quantity * result.price;
      $input.parent().next().text($.y.toCurrency(result.subTotal));
      updateFoot(products);
    });
    $tbody.on('click','a',function (event) {
      var $tr = $(this).parent().parent();
      var id = $tr.data('pid');
      $(this).parent().parent().remove();

      for(var i=0, len = products.length; i<len; i++){
        if(products[i].id==id){
          products.splice(i,1);
          updateFoot(products);
          break;
        }
      }
      return false;
      //event.preventDefault()
    });
    $('#cart tfoot a').on('click',function () {
      if($('#all').prop('checked')){
        $tbody.empty();
        products = [];
        updateFoot(products);
      }
      else{
        $tbody.children().each(function (index,item) {
          var $tr = $(item);
          if($tr.find('input[name=productID]').prop('checked')){
            $tr.find('a').trigger('click');
          }
        });

      }

    });
  });
})();
