$('#file').change(function() {
  var fr = new FileReader();
  fr.onload = function() {
    var img = $('<img>').attr('src', fr.result);
    $('#preview').append(img);
  };
  fr.readAsDataURL(this.files[0]);
});

$('#cafile').change(function() {
  var fr = new FileReader();
  fr.onload = function() {
    var img = $('<img>').attr('src', fr.result);
    $('#capreview').append(img);
  };
  fr.readAsDataURL(this.files[0]);
});
