# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

  $('#myTags').tagit
    fieldName:   'category_list'
    singleField: true
    placeholderText: 'タグの入力'
    autocomplete: {delay: 0, minLength: 2}
    availableTags: gon.available_tags
  $('#myTags').tagit()
  category_string = $("#category_hidden").val()
  try
    category_list = category_string.split(",")
    for tag in category_list
      $('#myTags').tagit 'createTag', tag
  catch error
