(function ($) {
    "use strict"; // Start of use strict

    // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on('click', function (e) {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function () {
        if ($(window).width() < 768) {
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function (e) {
        if ($(window).width() > 768) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        }
    });

    // Scroll to top button appear
    $(document).on('scroll', function () {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function (e) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1000, 'easeInOutExpo');
        e.preventDefault();
    });

})(jQuery); // End of use strict


/*!
 * http://suyati.github.io/line-control
 * LineControl 1.1.0
 * Copyright (C) 2014, Suyati Technologies
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with this library; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 *
*/

(function ($) {
    var methods = {
        saveSelection: function () {
            //Function to save the text selection range from the editor
            $(this).data('editor').focus();
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    $(this).data('currentRange', sel.getRangeAt(0));
                }
            } else if (document.selection && document.selection.createRange) {
                $(this).data('currentRange', document.selection.createRange());
            } else
                $(this).data('currentRange', null);
        },

        restoreSelection: function (text, mode) {
            //Function to restore the text selection range from the editor
            var node;
            typeof text !== 'undefined' ? text : false;
            typeof mode !== 'undefined' ? mode : "";
            var range = $(this).data('currentRange');
            if (range) {
                if (window.getSelection) {
                    if (text) {
                        range.deleteContents();
                        if (mode == "html") {
                            var el = document.createElement("div");
                            el.innerHTML = text;
                            var frag = document.createDocumentFragment(),
                                node, lastNode;
                            while ((node = el.firstChild)) {
                                lastNode = frag.appendChild(node);
                            }
                            range.insertNode(frag);
                        } else
                            range.insertNode(document.createTextNode(text));

                    }
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection && range.select) {
                    range.select();
                    if (text) {
                        if (mode == "html")
                            range.pasteHTML(text);
                        else
                            range.text = text;
                    }
                }
            }
        },

        restoreIESelection: function () {
            //Function to restore the text selection range from the editor in IE
            var range = $(this).data('currentRange');
            if (range) {
                if (window.getSelection) {
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection && range.select) {
                    range.select();
                }
            }
        },

        insertTextAtSelection: function (text, mode) {
            var sel, range, node;
            typeof mode !== 'undefined' ? mode : "";
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    var textNode = document.createTextNode(text);

                    if (mode == "html") {
                        var el = document.createElement("div");
                        el.innerHTML = text;
                        var frag = document.createDocumentFragment(),
                            node, lastNode;
                        while ((node = el.firstChild)) {
                            lastNode = frag.appendChild(node);
                        }
                        range.insertNode(frag);
                    } else {
                        range.insertNode(textNode);
                        range.selectNode(textNode);
                    }
                    sel.removeAllRanges();
                    range = range.cloneRange();
                    range.collapse(false);
                    sel.addRange(range);
                }
            } else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                range.pasteHTML(text);
                range.select();
            }
        },

        imageWidget: function () {
            //Class for Widget Handling the upload of Files
            var row = $('<div/>', {
                "class": "row"
            }).append($('<div/>', {
                id: "imgErrMsg"
            }));
            var container = $('<div/>', {
                'class': "tabbable tabs-left"
            });
            var navTabs = $('<ul/>', {
                class: "nav nav-tabs"
            }).append($('<li/>', {
                class: "active"
            }).append($('<a/>', {
                "href": "#uploadImageBar",
                "data-toggle": "tab"
            }).html("From Computer"))).append($('<li/>').append($('<a/>', {
                "href": "#imageFromLinkBar",
                "data-toggle": "tab"
            }).html("From URL")));

            var tabContent = $("<div/>", {
                class: "tab-content"
            });
            var uploadImageBar = $("<div/>", {
                id: "uploadImageBar",
                class: "tab-pane active"
            });

            handleFileSelect = function (evt) {
                var files = evt.target.files; // FileList object
                var output = [];
                for (var i = 0, f; f = files[i]; i++) {
                    //Loop thorugh all the files
                    if (!f.type.match('image.*') || !f.name.match(/(?:gif|jpg|png|jpeg)$/)) { //Process only Images
                        methods.showMessage.apply(this, ["imgErrMsg", "Invalid file type"]);
                        continue;
                    }
                    var reader = new FileReader();
                    reader.onload = (function (imageFile) {
                        return function (e) {
                            //Render Thumnails
                            var li = $('<li/>', {
                                class: "col-xs-12 col-sm-6 col-md-3 col-lg-3"
                            });
                            var a = $('<a/>', {
                                href: "javascript:void(0)",
                                class: "thumbnail"
                            });
                            var image = $('<img/>', {
                                src: e.target.result,
                                title: escape(imageFile.name)
                            }).appendTo(a).click(function () {
                                $('#imageList').data('current', $(this).attr('src'));
                            });
                            li.append(a).appendTo($('#imageList'));
                        }
                    })(f);
                    reader.readAsDataURL(f);
                }
            }
            var chooseFromLocal = $('<input/>', {
                type: "file",
                class: "inline-form-control",
                multiple: "multiple"
            });
            chooseFromLocal.on('change', handleFileSelect);
            uploadImageBar.append(chooseFromLocal);
            var imageFromLinkBar = $("<div/>", {
                id: "imageFromLinkBar",
                class: "tab-pane"
            });
            var getImageURL = $("<div/>", {
                class: "input-group"
            });
            var imageURL = $('<input/>', {
                type: "url",
                class: 'form-control',
                id: "imageURL",
                placeholder: "Enter URL"
            }).appendTo(getImageURL);
            var getURL = $("<button/>", {
                class: "btn btn-success",
                type: "button"
            }).html("Go!").click(function () {
                var url = $('#imageURL').val();
                if (url == '') {
                    methods.showMessage.apply(this, ["imgErrMsg", "Please enter image url"]);
                    return false;
                }
                var li = $('<li/>', {
                    class: "span6 col-xs-12 col-sm-6 col-md-3 col-lg-3"
                });
                var a = $('<a/>', {
                    href: "javascript:void(0)",
                    class: "thumbnail"
                });
                var image = $('<img/>', {
                    src: url,
                }).error(function () {
                    methods.showMessage.apply(this, ["imgErrMsg", "Invalid image url"]);
                    return false;
                }).load(function () {
                    $(this).appendTo(a).click(function () {
                        $('#imageList').data('current', $(this).attr('src'));
                    });
                    li.append(a).appendTo($('#imageList'));
                });
            }).appendTo($("<span/>", {
                class: "input-group-btn form-control-button-right"
            }).appendTo(getImageURL));

            imageFromLinkBar.append(getImageURL);
            tabContent.append(uploadImageBar).append(imageFromLinkBar);
            container.append(navTabs).append(tabContent);

            var imageListContainer = $("<div/>", {
                'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12'
            });
            var imageList = $('<ul/>', {
                "class": "thumbnails padding-top list-unstyled",
                "id": 'imageList'
            }).appendTo(imageListContainer);
            row.append(container).append(imageListContainer);
            return row;
        },

        tableWidget: function (mode) {
            //Function to generate the table input form
            var idExtn = '';
            if (typeof mode !== 'undefined')
                idExtn = "Edt";

            var tblCntr = $('<div/>', { //Outer Container Div
                class: "row-fluid"
            }).append($('<div/>', { //Err Message Div
                id: "tblErrMsg" + idExtn
            })).append($('<form/>', { //Form 
                id: "tblForm" + idExtn
            }).append($('<div/>', { //Inner Container Div
                class: "row"
            }).append($('<div/>', { //Left input Container Div
                id: "tblInputsLeft" + idExtn,
                class: "col-xs-12 col-sm-6 col-md-6 col-lg-6"
            }).append($('<label/>', {
                for: "tblRows" + idExtn,
                text: "Rows"
            })).append($('<input/>', {
                id: "tblRows" + idExtn,
                type: "text",
                class: "form-control form-control-width",
                value: 2
            })).append($('<label/>', {
                for: "tblColumns" + idExtn,
                text: "Columns"
            })).append($('<input/>', {
                id: "tblColumns" + idExtn,
                type: "text",
                class: "form-control form-control-width",
                value: 2
            })).append($('<label/>', {
                for: "tblWidth" + idExtn,
                text: "Width"
            })).append($('<input/>', {
                id: "tblWidth" + idExtn,
                type: "text",
                class: "form-control form-control-width",
                value: 400
            })).append($('<label/>', {
                for: "tblHeight" + idExtn,
                text: "Height"
            })).append($('<input/>', {
                id: "tblHeight" + idExtn,
                type: "text",
                class: "form-control form-control-width",
            }))).append($('<div/>', { //Right input Container Div
                id: "tblInputsRight" + idExtn,
                class: "col-xs-12 col-sm-6 col-md-6 col-lg-6"
            }).append($('<label/>', {
                for: "tblAlign" + idExtn,
                text: "Alignment"
            })).append($('<select/>', {
                id: "tblAlign" + idExtn,
                class: "form-control form-control-width"
            }).append($('<option/>', {
                text: "Choose",
                value: ""
            })).append($('<option/>', {
                text: "Left",
                value: "left"
            })).append($('<option/>', {
                text: "Center",
                value: "center"
            })).append($('<option/>', {
                text: "Right",
                value: "right"
            }))).append($('<label/>', {
                for: "tblBorder" + idExtn,
                text: "Border size"
            })).append($('<input/>', {
                id: "tblBorder" + idExtn,
                type: "text",
                class: "form-control form-control-width",
                value: 1
            })).append($('<label/>', {
                for: "tblCellspacing" + idExtn,
                text: "Cell spacing"
            })).append($('<input/>', {
                id: "tblCellspacing" + idExtn,
                type: "text",
                class: "form-control form-control-width",
                value: 1
            })).append($('<label/>', {
                for: "tblCellpadding" + idExtn,
                text: "Cell padding"
            })).append($('<input/>', {
                id: "tblCellpadding" + idExtn,
                type: "text",
                class: "form-control form-control-width",
                value: 1
            })))))
            return tblCntr;
        },

        imageAttributeWidget: function () {

            var edtTablecntr = $('<div/>', {
                class: "row-fluid"
            }).append($('<div/>', { //Err Message Div
                id: "imageErrMsg"
            })).append($('<input/>', {
                id: "imgAlt",
                type: "text",
                class: "form-control form-control-link ",
                placeholder: "Alt Text",
            })).append($('<input/>', {
                id: "imgTarget",
                class: "form-control form-control-link ",
                type: "text",
                placeholder: "Link Target"
            })).append($('<input/>', {
                id: "imgHidden",
                type: "hidden"
            }))

            return edtTablecntr;

        },

        getHTMLTable: function (tblRows, tblColumns, attributes) {
            //Function to generate html table. Supplied arguments: tablerows-no.of rows, no.of columns, table attributes.
            var tableElement = $('<table/>', {
                class: "table"
            });
            for (var i = 0; i < attributes.length; i++) {
                if (attributes[i].value != '') {
                    if (attributes[i].attribute == "width" || attributes[i].attribute == "height")
                        tableElement.css(attributes[i].attribute, attributes[i].value);
                    else
                        tableElement.attr(attributes[i].attribute, attributes[i].value);
                }
            }
            for (var i = 1; i <= tblRows; i++) {
                var tblRow = $('<tr/>');
                for (var j = 1; j <= tblColumns; j++) {
                    var tblColumn = $('<td/>').html('&nbsp;');
                    tblColumn.appendTo(tblRow);
                }
                tblRow.appendTo(tableElement);
            }
            return tableElement;
        },

        init: function (options) {
            var fonts = {
                "Sans serif": "arial,helvetica,sans-serif",
                "Serif": "times new roman,serif",
                "Wide": "arial black,sans-serif",
                "Narrow": "arial narrow,sans-serif",
                "Comic Sans MS": "comic sans ms,sans-serif",
                "Courier New": "courier new,monospace",
                "Garamond": "garamond,serif",
                "Georgia": "georgia,serif",
                "Tahoma": "tahoma,sans-serif",
                "Trebuchet MS": "trebuchet ms,sans-serif",
                "Verdana": "verdana,sans-serif"
            };

            var styles = {
                "Heading 1": "<h1>",
                "Heading 2": "<h2>",
                "Heading 3": "<h3>",
                "Heading 4": "<h4>",
                "Heading 5": "<h5>",
                "Heading 6": "<h6>",
                "Paragraph": "<p>"
            };

            var fontsizes = {
                "Small": "2",
                "Normal": "3",
                "Medium": "4",
                "Large": "5",
                "Huge": "6"
            };

            var colors = [{
                    name: 'Black',
                    hex: '#000000'
                },
                {
                    name: 'MediumBlack',
                    hex: '#444444'
                },
                {
                    name: 'LightBlack',
                    hex: '#666666'
                },
                {
                    name: 'DimBlack',
                    hex: '#999999'
                },
                {
                    name: 'Gray',
                    hex: '#CCCCCC'
                },
                {
                    name: 'DimGray',
                    hex: '#EEEEEE'
                },
                {
                    name: 'LightGray',
                    hex: '#F3F3F3'
                },
                {
                    name: 'White',
                    hex: '#FFFFFF'
                },

                {
                    name: 'libreak',
                    hex: null
                },

                {
                    name: 'Red',
                    hex: '#FF0000'
                },
                {
                    name: 'Orange',
                    hex: '#FF9900'
                },
                {
                    name: 'Yellow',
                    hex: '#FFFF00'
                },
                {
                    name: 'Lime',
                    hex: '#00FF00'
                },
                {
                    name: 'Cyan',
                    hex: '#00FFFF'
                },
                {
                    name: 'Blue',
                    hex: '#0000FF'
                },
                {
                    name: 'BlueViolet',
                    hex: '#8A2BE2'
                },
                {
                    name: 'Magenta',
                    hex: '#FF00FF'
                },

                {
                    name: 'libreak',
                    hex: null
                },

                {
                    name: 'LightPink',
                    hex: '#FFB6C1'
                },
                {
                    name: 'Bisque',
                    hex: '#FCE5CD'
                },
                {
                    name: 'BlanchedAlmond',
                    hex: '#FFF2CC'
                },
                {
                    name: 'LightLime',
                    hex: '#D9EAD3'
                },
                {
                    name: 'LightCyan',
                    hex: '#D0E0E3'
                },
                {
                    name: 'AliceBlue',
                    hex: '#CFE2F3'
                },
                {
                    name: 'Lavender',
                    hex: '#D9D2E9'
                },
                {
                    name: 'Thistle',
                    hex: '#EAD1DC'
                },

                {
                    name: 'LightCoral',
                    hex: '#EA9999'
                },
                {
                    name: 'Wheat',
                    hex: '#F9CB9C'
                },
                {
                    name: 'NavajoWhite',
                    hex: '#FFE599'
                },
                {
                    name: 'DarkSeaGreen',
                    hex: '#B6D7A8'
                },
                {
                    name: 'LightBlue',
                    hex: '#A2C4C9'
                },
                {
                    name: 'SkyBlue',
                    hex: '#9FC5E8'
                },
                {
                    name: 'LightPurple',
                    hex: '#B4A7D6'
                },
                {
                    name: 'PaleVioletRed',
                    hex: '#D5A6BD'
                },

                {
                    name: 'IndianRed',
                    hex: '#E06666'
                },
                {
                    name: 'LightSandyBrown',
                    hex: '#F6B26B'
                },
                {
                    name: 'Khaki',
                    hex: '#FFD966'
                },
                {
                    name: 'YellowGreen',
                    hex: '#93C47D'
                },
                {
                    name: 'CadetBlue',
                    hex: '#76A5AF'
                },
                {
                    name: 'DeepSkyBlue',
                    hex: '#6FA8DC'
                },
                {
                    name: 'MediumPurple',
                    hex: '#8E7CC3'
                },
                {
                    name: 'MediumVioletRed',
                    hex: '#C27BA0'
                },

                {
                    name: 'Crimson',
                    hex: '#CC0000'
                },
                {
                    name: 'SandyBrown',
                    hex: '#E69138'
                },
                {
                    name: 'Gold',
                    hex: '#F1C232'
                },
                {
                    name: 'MediumSeaGreen',
                    hex: '#6AA84F'
                },
                {
                    name: 'Teal',
                    hex: '#45818E'
                },
                {
                    name: 'SteelBlue',
                    hex: '#3D85C6'
                },
                {
                    name: 'SlateBlue',
                    hex: '#674EA7'
                },
                {
                    name: 'VioletRed',
                    hex: '#A64D79'
                },

                {
                    name: 'Brown',
                    hex: '#990000'
                },
                {
                    name: 'Chocolate',
                    hex: '#B45F06'
                },
                {
                    name: 'GoldenRod',
                    hex: '#BF9000'
                },
                {
                    name: 'Green',
                    hex: '#38761D'
                },
                {
                    name: 'SlateGray',
                    hex: '#134F5C'
                },
                {
                    name: 'RoyalBlue',
                    hex: '#0B5394'
                },
                {
                    name: 'Indigo',
                    hex: '#351C75'
                },
                {
                    name: 'Maroon',
                    hex: '#741B47'
                },

                {
                    name: 'DarkRed',
                    hex: '#660000'
                },
                {
                    name: 'SaddleBrown',
                    hex: '#783F04'
                },
                {
                    name: 'DarkGoldenRod',
                    hex: '#7F6000'
                },
                {
                    name: 'DarkGreen',
                    hex: '#274E13'
                },
                {
                    name: 'DarkSlateGray',
                    hex: '#0C343D'
                },
                {
                    name: 'Navy',
                    hex: '#073763'
                },
                {
                    name: 'MidnightBlue',
                    hex: '#20124D'
                },
                {
                    name: 'DarkMaroon',
                    hex: '#4C1130'
                }];

            var specialchars = [{
                    name: "Prioridad 5",
                    text: "<span style='background-color:#FDD300;'>{prioridad:5}</span>"
                },
                {
                    name: "Prioridad 4",
                    text: "<span style='background-color:#FDD300;'>{prioridad:4}</span>"
                },
                {
                    name: "Prioridad 3",
                    text: "<span style='background-color:#FDD300;'>{prioridad:3}</span>"
                },
                {
                    name: "Prioridad 2",
                    text: "<span style='background-color:#FDD300;'>{prioridad:2}</span>"
                },
                {
                    name: "Prioridad 1",
                    text: "<span style='background-color:#FDD300;'>{prioridad:2}</span>"
                }];

            var specialchars2 = [
                {
                    name: "Impacto 5",
                    text: "<span style='background-color:#FDD300;'>{impacto:5}</span>"
                },
                {
                    name: "Impacto 4",
                    text: "<span style='background-color:#FDD300;'>{impacto:4}</span>"
                },
                {
                    name: "Impacto 3",
                    text: "<span style='background-color:#FDD300;'>{impacto:3}</span>"
                },
                {
                    name: "Impacto 2",
                    text: "<span style='background-color:#FDD300;'>{impacto:2}</span>"
                },
                {
                    name: "Impacto 1",
                    text: "<span style='background-color:#FDD300;'>{impacto:1}</span>"
                }];

            var menuItems = {
                'fonteffects': true,
                'texteffects': true,
                'aligneffects': true,
                'textformats': true,
                'actions': true,
                'insertoptions': true,
                'extraeffects': true,
                'advancedoptions': true,
                'screeneffects': true,

                'fonts': {
                    "select": true,
                    "default": "Font",
                    "tooltip": "Fonts",
                    "commandname": "fontName",
                    "custom": null
                },

                'styles': {
                    "select": true,
                    "default": "Formatting",
                    "tooltip": "Paragraph Format",
                    "commandname": "formatBlock",
                    "custom": null
                },

                'font_size': {
                    "select": true,
                    "default": "Font size",
                    "tooltip": "Font Size",
                    "commandname": "fontSize",
                    "custom": null
                },

                'color': {
                    "text": "A",
                    "icon": "fa fa-font",
                    "tooltip": "Text/Background Color",
                    "commandname": null,
                    "custom": function (button) {
                        var flag = 0;
                        var paletteCntr = $('<div/>', {
                            id: "paletteCntr",
                            class: "activeColour",
                            css: {
                                "display": "none",
                                "width": "335px"
                            }
                        }).click(function (event) {
                            event.stopPropagation();
                        });
                        var paletteDiv = $('<div/>', {
                            id: "colorpellete"
                        });
                        var palette = $('<ul />', {
                            id: "color_ui"
                        }).append($('<li />').css({
                            "width": "145px",
                            "display": "Block",
                            "height": "25px"
                        }).html('<div>Text Color</div>'));
                        var bgPalletteDiv = $('<div/>', {
                            id: "bg_colorpellete"
                        });
                        var bgPallette = $('<ul />', {
                            id: "bgcolor_ui"
                        }).append($('<li />').css({
                            "width": "145px",
                            "display": "Block",
                            "height": "25px"
                        }).html('<div>Background Color</div>'));
                        if ($('#contentarea').data("colorBtn")) {
                            flag = 1;
                            $('#contentarea').data("colorBtn", null);
                        } else
                            $('#contentarea').data("colorBtn", 1);
                        if (flag == 0) {
                            for (var i = 0; i < colors.length; i++) {
                                if (colors[i].hex != null) {
                                    palette.append($('<li />').css('background-color', colors[i].hex).mousedown(function (event) {
                                        event.preventDefault();
                                    }).click(function () {
                                        var hexcolor = methods.rgbToHex.apply(this, [$(this).css('background-color')]);
                                        methods.restoreSelection.apply(this);
                                        methods.setStyleWithCSS.apply(this);
                                        document.execCommand('forecolor', false, hexcolor);
                                        $('#paletteCntr').remove();
                                        $('#contentarea').data("colorBtn", null);
                                    }));

                                    bgPallette.append($('<li />').css('background-color', colors[i].hex).mousedown(function (event) {
                                        event.preventDefault();
                                    }).click(function () {
                                        var hexcolor = methods.rgbToHex.apply(this, [$(this).css('background-color')]);
                                        methods.restoreSelection.apply(this);
                                        methods.setStyleWithCSS.apply(this);
                                        document.execCommand('backColor', false, hexcolor);
                                        $('#paletteCntr').remove();
                                        $('#contentarea').data("colorBtn", null);
                                    }));
                                } else {
                                    palette.append($('<li />').css({
                                        "width": "145px",
                                        "display": "Block",
                                        "height": "5px"
                                    }));
                                    bgPallette.append($('<li />').css({
                                        "width": "145px",
                                        "display": "Block",
                                        "height": "5px"
                                    }));
                                }
                            }
                            palette.appendTo(paletteDiv);
                            bgPallette.appendTo(bgPalletteDiv);
                            paletteDiv.appendTo(paletteCntr);
                            bgPalletteDiv.appendTo(paletteCntr)
                            paletteCntr.insertAfter(button);
                            $('#paletteCntr').slideDown('slow');
                        } else
                            $('#paletteCntr').remove();
                    }
                },

                'bold': {
                    "text": "B",
                    "icon": "fa fa-bold",
                    "tooltip": "Bold",
                    "commandname": "bold",
                    "custom": null
                },

                'italics': {
                    "text": "I",
                    "icon": "fa fa-italic",
                    "tooltip": "Italics",
                    "commandname": "italic",
                    "custom": null
                },

                'underline': {
                    "text": "U",
                    "icon": "fa fa-underline",
                    "tooltip": "Underline",
                    "commandname": "underline",
                    "custom": null
                },

                'strikeout': {
                    "text": "Strikeout",
                    "icon": "fa fa-strikethrough",
                    "tooltip": "Strike Through",
                    "commandname": "strikeThrough",
                    "custom": null
                },

                'ol': {
                    "text": "N",
                    "icon": "fa fa-list-ol",
                    "tooltip": "Insert/Remove Numbered List",
                    "commandname": "insertorderedlist",
                    "custom": null
                },

                'ul': {
                    "text": "Bullet",
                    "icon": "fa fa-list-ul",
                    "tooltip": "Insert/Remove Bulleted List",
                    "commandname": "insertunorderedlist",
                    "custom": null
                },

                'undo': {
                    "text": "undo",
                    "icon": "fa fa-undo",
                    "tooltip": "Undo",
                    "commandname": "undo",
                    "custom": null
                },

                'redo': {
                    "text": "redo",
                    "icon": "fa fa-repeat",
                    "tooltip": "Redo",
                    "commandname": "redo",
                    "custom": null
                },

                'l_align': {
                    "text": "leftalign",
                    "icon": "fa fa-align-left",
                    "tooltip": "Align Left",
                    "commandname": "justifyleft",
                    "custom": null
                },

                'r_align': {
                    "text": "rightalign",
                    "icon": "fa fa-align-right",
                    "tooltip": "Align Right",
                    "commandname": "justifyright",
                    "custom": null
                },

                'c_align': {
                    "text": "centeralign",
                    "icon": "fa fa-align-center",
                    "tooltip": "Align Center",
                    "commandname": "justifycenter",
                    "custom": null
                },

                'justify': {
                    "text": "justify",
                    "icon": "fa fa-align-justify",
                    "tooltip": "Justify",
                    "commandname": "justifyfull",
                    "custom": null
                },

                'unlink': {
                    "text": "Unlink",
                    "icon": "fa fa-unlink",
                    "tooltip": "Unlink",
                    "commandname": "unlink",
                    "custom": null
                },

                'insert_link': {
                    "modal": true,
                    "modalId": "InsertLink",
                    "icon": "fa fa-link",
                    "tooltip": "Insert Link",
                    "modalHeader": "Insert Hyperlink",
                    "modalBody": $('<div/>', {
                        class: "form-group"
                    }).append($('<div/>', {
                        id: "errMsg"
                    })).append($('<input/>', {
                        type: "text",
                        id: "inputText",
                        class: "form-control form-control-link ",
                        placeholder: "Text to Display",
                    })).append($('<input/>', {
                        type: "text",
                        id: "inputUrl",
                        required: true,
                        class: "form-control form-control-link",
                        placeholder: "Enter URL"
                    })),
                    "beforeLoad": function () {
                        $('#inputText').val("");
                        $('#inputUrl').val("");
                        $(".alert").alert("close");
                        if ($(this).data('currentRange') != '') {
                            $('#inputText').val($(this).data('currentRange'));
                        }
                    },
                    "onSave": function () {
                        var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
                        var targetText = $('#inputText').val();
                        var targetURL = $('#inputUrl').val();
                        var range = $(this).data('currentRange');
                        if (targetURL == '') {
                            methods.showMessage.apply(this, ["errMsg", "Please enter url"]);
                            return false;
                        }
                        if (!targetURL.match(urlPattern)) {
                            methods.showMessage.apply(this, ["errMsg", "Enter valid url"]);
                            return false;
                        }
                        if (range == '' && targetText == '') {
                            targetText = targetURL;
                        }
                        if (navigator.userAgent.match(/MSIE/i)) {
                            var targetLink = '<a href="' + targetURL + '" target="_blank">' + targetText + '</a>';
                            methods.restoreSelection.apply(this, [targetLink, 'html']);
                        } else {
                            methods.restoreSelection.apply(this, [targetText]);
                            document.execCommand('createLink', false, targetURL);
                        }
                        $('#contentarea').find('a[href="' + targetURL + '"]').each(function () {
                            $(this).attr("target", "_blank");
                        });
                        $(".alert").alert("close");
                        $("#InsertLink").modal("hide");
                        $('#contentarea').focus();
                        return false;
                    }
                },

                'insert_img': {
                    "modal": true,
                    "modalId": "InsertImage",
                    "icon": "fa fa-picture-o",
                    "tooltip": "Insert Image",
                    "modalHeader": "Insert Image",
                    "modalBody": methods.imageWidget.apply(this),
                    "beforeLoad": function () {
                        $('#imageURL').val("");
                        $("#uploadImageBar :input").val("");
                        $('#imageList').data('current', "");
                    },
                    "onSave": function () {
                        methods.restoreSelection.apply(this);
                        if ($('#imageList').data('current')) {
                            if (navigator.userAgent.match(/MSIE/i)) {
                                var imageStr = '<img src="' + $('#imageList').data('current') + '"/>'
                                methods.restoreSelection.apply(this, [imageStr, 'html'])
                            } else {
                                document.execCommand('insertimage', false, $('#imageList').data('current'));
                            }
                        } else {
                            methods.showMessage.apply(this, ["imgErrMsg", "Please select an image"]);
                            return false;
                        }
                        $("#InsertImage").modal("hide");
                        $('#contentarea').focus();
                    }
                },

                'insert_table': {
                    "modal": true,
                    "modalId": "InsertTable",
                    "icon": "fa fa-table",
                    "tooltip": "Insert Table",
                    "modalHeader": "Insert Table",
                    "modalBody": methods.tableWidget.apply(this),
                    "beforeLoad": function () {
                        $('#tblForm').each(function () {
                            this.reset();
                        });
                    },
                    "onSave": function () {
                        methods.restoreSelection.apply(this);
                        var tblRows = $('#tblRows').val();
                        var tblColumns = $('#tblColumns').val();
                        var tblWidth = $('#tblWidth').val();
                        var tblHeight = $('#tblHeight').val();
                        var tblAlign = $('#tblAlign').val();
                        var tblBorder = $('#tblBorder').val();
                        var tblCellspacing = $('#tblCellspacing').val();
                        var tblCellpadding = $('#tblCellpadding').val();
                        var intReg = /^[0-9]+$/;
                        var cssReg = /^auto$|^[+-]?[0-9]+\.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc)?$/ig;
                        var numReg = /^[0-9]+\.?([0-9])?$/;

                        if (!tblRows.match(intReg)) {
                            methods.showMessage.apply(this, ["tblErrMsg", "Rows must be a positive number"]);
                            return false;
                        }
                        if (!tblColumns.match(intReg)) {
                            methods.showMessage.apply(this, ["tblErrMsg", "Columns must be a positive number"]);
                            return false;
                        }
                        if (tblWidth != "" && !tblWidth.match(cssReg)) {
                            methods.showMessage.apply(this, ["tblErrMsg", "Please enter positive number with or without a valid CSS measurement unit (px,em,ex,%,in,cm,mm,pt,pc)"]);
                            return false;
                        }
                        if (tblHeight != "" && !tblHeight.match(cssReg)) {
                            methods.showMessage.apply(this, ["tblErrMsg", "Please enter positive number with or without a valid CSS measurement unit (px,em,ex,%,in,cm,mm,pt,pc)"]);
                            return false;
                        }
                        if (tblBorder != "" && !tblBorder.match(numReg)) {
                            methods.showMessage.apply(this, ["tblErrMsg", "Border size must be a positive number"]);
                            return false;
                        }
                        if (tblCellspacing != "" && !tblCellspacing.match(numReg)) {
                            methods.showMessage.apply(this, ["tblErrMsg", "Cell spacing must be a positive number"]);
                            return false;
                        }
                        if (tblCellpadding != "" && !tblCellpadding.match(numReg)) {
                            methods.showMessage.apply(this, ["tblErrMsg", "Cell padding must be a positive number"]);
                            return false;
                        }

                        var htmlTableCntr = $('<div/>');
                        var tblAttributes = [
                            {
                                attribute: "align",
                                value: tblAlign
                            },
                            {
                                attribute: "border",
                                value: tblBorder
                            },
                            {
                                attribute: "cellspacing",
                                value: tblCellspacing
                            },
                            {
                                attribute: "cellpadding",
                                value: tblCellpadding
                            },
                            {
                                attribute: "width",
                                value: tblWidth
                            },
                            {
                                attribute: "height",
                                value: tblHeight
                            },
																	];
                        var htmlTable = methods.getHTMLTable.apply(this, [tblRows, tblColumns, tblAttributes]);
                        htmlTable.appendTo(htmlTableCntr);
                        if (navigator.userAgent.match(/MSIE/i))
                            methods.restoreSelection.apply(this, [htmlTableCntr.html(), 'html']);
                        else
                            document.execCommand('insertHTML', false, htmlTableCntr.html());
                        $("#InsertTable").modal("hide");
                        $('#contentarea').focus();
                    }
                },

                'hr_line': {
                    "text": "HR",
                    "icon": "fa fa-minus",
                    "tooltip": "Horizontal Rule",
                    "commandname": "insertHorizontalRule",
                    "custom": null
                },

                'block_quote': {
                    "text": "Block Quote",
                    "icon": "fa fa-quote-right",
                    "tooltip": "Block Quote",
                    "commandname": null,
                    "custom": function () {
                        methods.setStyleWithCSS.apply(this);
                        if (navigator.userAgent.match(/MSIE/i)) {
                            document.execCommand('indent', false, null);
                        } else {
                            document.execCommand('formatBlock', false, '<blockquote>');
                        }
                    }
                },

                'indent': {
                    "text": "Indent",
                    "icon": "fa fa-indent",
                    "tooltip": "Increase Indent",
                    "commandname": "indent",
                    "custom": null
                },

                'outdent': {
                    "text": "Outdent",
                    "icon": "fa fa-outdent",
                    "tooltip": "Decrease Indent",
                    "commandname": "outdent",
                    "custom": null
                },

                'print': {
                    "text": "Print",
                    "icon": "fa fa-print",
                    "tooltip": "Print",
                    "commandname": null,
                    "custom": function () {
                        oDoc = document.getElementById("contentarea");
                        var oPrntWin = window.open("", "_blank", "width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
                        oPrntWin.document.open();
                        oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
                        oPrntWin.document.close();
                    }
                },

                'rm_format': {
                    "text": "Remover estilos",
                    "icon": "fa fa-eraser",
                    "tooltip": "Remover estilos",
                    "commandname": "removeformat",
                    "custom": null
                },

                'select_all': {
                    "text": "Select all",
                    "icon": "fa fa-file-text",
                    "tooltip": "Select All",
                    "commandname": null,
                    "custom": function () {
                        document.execCommand("selectall", null, null);
                    }
                },

                'togglescreen': {
                    "text": "Toggle Screen",
                    "icon": "fa fa-arrows-alt",
                    "tooltip": "Toggle Screen",
                    "commandname": null,
                    "custom": function (button, parameters) {
                        $(".Editor-container").toggleClass('fullscreen');
                        var statusdBarHeight = 0;
                        if ($("#statusbar").length) {
                            statusdBarHeight = $("#statusbar").height();
                        }
                        if ($(".Editor-container").hasClass('fullscreen'))
                            $("#contentarea").css({
                                "height": $(".Editor-container").height() - ($("#menuBarDiv").height() + statusdBarHeight) - 13
                            });
                        else
                            $("#contentarea").css({
                                "height": ""
                            });
                    }
                },

                'splchars': {
                    "text": "Prioridades",
                    "tooltip": "Insertar prioridades",
                    "commandname": null,
                    "custom": function (button) {
                        methods.restoreIESelection.apply(this);
                        var flag = 0;
                        var splCharDiv = $('<div/>', {
                            id: "specialchar",
                            class: "specialCntr",
                            css: {
                                "display": "none"
                            }
                        }).click(function (event) {
                            event.stopPropagation();
                        });
                        var splCharUi = $('<ul />', {
                            id: "special_ui"
                        });
                        if ($('#contentarea').data("splcharsBtn")) {
                            flag = 1;
                            $('#contentarea').data("splcharsBtn", null);
                        } else
                            $('#contentarea').data("splcharsBtn", 1);

                        if (flag == 0) {
                            for (var i = 0; i < specialchars.length; i++) {
                                splCharUi.append($('<li />').html(specialchars[i].name).attr('title', specialchars[i].name).attr('data-src', specialchars[i].text).mousedown(function (event) {
                                    event.preventDefault();
                                }).click(function (event) {
                                    if (navigator.userAgent.match(/MSIE/i)) {
                                        var specCharHtml = $(this).html(specialchars[i].text);
                                        methods.insertTextAtSelection.apply(this, [specCharHtml, 'html']);
                                    } else {
                                        var textos = "<span style='background-color:#FDD300;'>" + $(this).attr("data-src") + "</span>";
                                        document.execCommand('insertHTML', true, textos);
                                    }
                                    $('#specialchar').remove();
                                    $('#contentarea').data("splcharsBtn", null);
                                }));
                            }
                            splCharUi.prependTo(splCharDiv);
                            splCharDiv.insertAfter(button)
                            $('#specialchar').slideDown('slow');
                        } else
                            $('#specialchar').remove();
                    }
                },

                'splchars2': {
                    "text": "Impactos",
                    "tooltip": "Insertar impactos",
                    "commandname": null,
                    "custom": function (button) {
                        methods.restoreIESelection.apply(this);
                        var flag = 0;
                        var splCharDiv = $('<div/>', {
                            id: "specialchar",
                            class: "specialCntr",
                            css: {
                                "display": "none"
                            }
                        }).click(function (event) {
                            event.stopPropagation();
                        });
                        var splCharUi = $('<ul />', {
                            id: "special_ui"
                        });
                        if ($('#contentarea').data("splcharsBtn")) {
                            flag = 1;
                            $('#contentarea').data("splcharsBtn", null);
                        } else
                            $('#contentarea').data("splcharsBtn", 1);

                        if (flag == 0) {
                            for (var i = 0; i < specialchars2.length; i++) {
                                splCharUi.append($('<li />').html(specialchars2[i].name).attr('title', specialchars2[i].name).attr('data-src', specialchars2[i].text).mousedown(function (event) {
                                    event.preventDefault();
                                }).click(function (event) {
                                    if (navigator.userAgent.match(/MSIE/i)) {
                                        var specCharHtml = $(this).html(specialchars2[i].text);
                                        methods.insertTextAtSelection.apply(this, [specCharHtml, 'html']);
                                    } else {
                                        var textos = "<span style='background-color:#FDD300;'>" + $(this).attr("data-src") + "</span>";
                                        document.execCommand('insertHTML', true, textos);
                                    }
                                    $('#specialchar').remove();
                                    $('#contentarea').data("splcharsBtn", null);
                                }));
                            }
                            splCharUi.prependTo(splCharDiv);
                            splCharDiv.insertAfter(button)
                            $('#specialchar').slideDown('slow');
                        } else
                            $('#specialchar').remove();
                    }
                },

                'source': {
                    "text": "Source",
                    "icon": "fa fa-code",
                    "tooltip": "Source",
                    "commandname": null,
                    "custom": function (button, params) {
                        methods.getSource.apply(this, [button, params])
                    }
                },
                "params": {
                    "obj": null
                },
            };

            var menuGroups = {
                'texteffects': ['bold', 'italics', 'underline', 'color'],
                'aligneffects': ['l_align', 'c_align', 'r_align', 'justify'],
                'textformats': ['indent', 'outdent', 'block_quote', 'ol', 'ul'],
                'fonteffects': ['fonts', 'styles', 'font_size'],
                'actions': ['undo', 'redo'],
                'insertoptions': ['insert_link', 'unlink', 'insert_img', 'insert_table'],
                'extraeffects': ['strikeout', 'hr_line', 'splchars'],
                'advancedoptions': ['print', 'rm_format', 'select_all', 'source'],
                'screeneffects': ['togglescreen']
            };

            var settings = $.extend({
                'texteffects': false,
                'aligneffects': true,
                'textformats': false,
                'fonteffects': false,
                'actions': true,
                'insertoptions': true,
                'extraeffects': false,
                'advancedoptions': false,
                'screeneffects': true,
                'bold': true,
                'italics': true,
                'underline': true,
                'ol': true,
                'ul': true,
                'undo': true,
                'redo': false,
                'l_align': true,
                'r_align': true,
                'c_align': true,
                'justify': true,
                'insert_link': false,
                'unlink': false,
                'insert_img': false,
                'hr_line': false,
                'block_quote': false,
                'source': false,
                'strikeout': false,
                'indent': false,
                'outdent': false,
                'fonts': false,
                'styles': styles,
                'print': false,
                'rm_format': true,
                'status_bar': false,
                'font_size': fontsizes,
                'color': colors,
                'splchars': true,
                'splchars2': true,
                'insert_table': false,
                'select_all': false,
                'togglescreen': false
            }, options);

            var containerDiv = $("<div/>", {
                class: "row-fluid Editor-container"
            });
            var $this = $(this).hide();
            $this.after(containerDiv);

            var menuBar = $("<div/>", {
                id: "menuBarDiv",
                class: "row-fluid"
            }).prependTo(containerDiv);
            var editor = $("<div/>", {
                class: "Editor-editor",
                css: {
                    overflow: "auto"
                },
                contenteditable: "true",
                id: 'contentarea'
            }).appendTo(containerDiv);
            if (settings['status_bar']) {
                var statusBar = $("<div/>", {
                    id: "statusbar",
                    class: "row-fluid",
                    unselectable: "on",
                }).appendTo(containerDiv);
                $('#contentarea').keyup(function (event) {
                    var wordCount = methods.getWordCount.apply(this);
                    $("#statusbar").html('<div class="label">' + 'Words : ' + wordCount + '</div>');
                });
            }
            $(this).data("menuBar", menuBar);
            $(this).data("editor", editor);
            $(this).data("statusBar", statusBar);


            for (var item in menuItems) {
                if (!settings[item]) { //if the display is not set to true for the button in the settings.	       		
                    if (settings[item] in menuGroups) {
                        for (var each in menuGroups[item]) {
                            settings[each] = false;
                        }
                    }
                    continue;
                }
                if (item in menuGroups) {
                    var group = $("<div/>", {
                        class: "btn-group"
                    });
                    for (var index = 0; index < menuGroups[item].length; index++) {
                        var value = menuGroups[item][index];
                        if (settings[value]) {
                            var menuItem = methods.createMenuItem.apply(this, [menuItems[value], settings[value], true]);
                            group.append(menuItem);
                        }
                        settings[value] = false;
                    }
                    menuBar.append(group);
                } else {
                    var menuItem = methods.createMenuItem.apply(this, [menuItems[item], settings[item], true]);
                    menuBar.append(menuItem);
                }
            }

            //For contextmenu	       	
            $(document.body).mousedown(function (event) {
                var target = $(event.target);
                if (!target.parents().addBack().is('#context-menu')) { // Clicked outside
                    $('#context-menu').remove();
                }
                if (!target.parents().addBack().is('#specialchar') && (target.closest('a').html() != '<i class="fa fa-asterisk"></i>')) { //Clicked outside
                    if ($("#specialchar").is(':visible')) {
                        $('#contentarea').data("splcharsBtn", null);
                        $('#specialchar').remove();
                    }
                }
                if (!target.parents().addBack().is('#paletteCntr') && (target.closest('a').html() != '<i class="fa fa-font"></i>')) { //Clicked outside
                    if ($("#paletteCntr").is(':visible')) {
                        $('#contentarea').data("colorBtn", null);
                        $('#paletteCntr').remove();
                    }
                }
            });
            $('#contentarea').bind("contextmenu", function (e) {
                if ($('#context-menu').length)
                    $('#context-menu').remove();
                var cMenu = $('<div/>', {
                    id: "context-menu"
                }).css({
                    position: "absolute",
                    top: e.pageY,
                    left: e.pageX,
                    "z-index": 9999
                }).click(function (event) {
                    event.stopPropagation();
                });
                var cMenuUl = $('<ul/>', {
                    class: "dropdown-menu on",
                    "role": "menu"
                });
                e.preventDefault();
                if ($(e.target).is('a')) {
                    methods.createLinkContext.apply(this, [e, cMenuUl]);
                    cMenuUl.appendTo(cMenu);
                    cMenu.appendTo('body');
                } else if ($(e.target).is('td')) {
                    methods.createTableContext.apply(this, [e, cMenuUl]);
                    cMenuUl.appendTo(cMenu);
                    cMenu.appendTo('body');
                } else if ($(e.target).is('img')) {

                    methods.createImageContext.apply(this, [e, cMenuUl]);
                    cMenuUl.appendTo(cMenu);
                    cMenu.appendTo('body');
                }
            });
        },
        createLinkContext: function (event, cMenuUl) {
            var cMenuli = $('<li/>').append($('<a/>', {
                id: "rem_link",
                "href": "javascript:void(0)",
                "text": "RemoveLink"
            }).click(function (e) {
                return function () {
                    $(e.target).contents().unwrap();
                    $('#context-menu').remove();
                }
            }(event)));
            cMenuli.appendTo(cMenuUl);

        },

        createImageContext: function (event, cMenuUl) {
            var cModalId = "imgAttribute";
            var cModalHeader = "Image Attributes";
            var imgModalBody = methods.imageAttributeWidget.apply(this, ["edit"]);
            var onSave = function () {
                var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
                var imageAlt = $('#imgAlt').val();
                var imageTarget = $('#imgTarget').val();
                if (imageAlt == "") {
                    methods.showMessage.apply(this, ["imageErrMsg", "Please enter image alternative text"]);
                    return false;
                }
                if (imageTarget != "" && !imageTarget.match(urlPattern)) {
                    methods.showMessage.apply(this, ["imageErrMsg", "Please enter valid url"]);
                    return false;
                }
                if ($("#imgHidden").val() != "") {
                    var imgId = $("#imgHidden").val();
                    $("#" + imgId).attr('alt', imageAlt);
                    if (imageTarget != "") {
                        if ($("#wrap_" + imgId).length)
                            $("#wrap_" + imgId).attr("href", imageTarget);
                        else
                            $("#" + imgId).wrap($('<a/>', {
                                id: "wrap_" + imgId,
                                href: imageTarget,
                                target: "_blank"
                            }));
                    } else {
                        if ($("#wrap_" + imgId).length)
                            $("#" + imgId).unwrap();
                    }
                }
                $("#imgAttribute").modal("hide");
                $('#contentarea').focus();
            };
            methods.createModal.apply(this, [cModalId, cModalHeader, imgModalBody, onSave]);
            var modalTrigger = $('<a/>', {
                href: "#" + cModalId,
                "text": "Image Attributes",
                "data-toggle": "modal"
            }).click(function (e) {
                return function () {
                    $('#context-menu').remove();
                    var stamp = (new Date).getTime();
                    $('#imgAlt').val($(e.target).closest("img").attr("alt"));
                    $('#imgTarget').val('');

                    if (typeof $(e.target).closest("img").attr("id") !== "undefined") {
                        var identifier = $(e.target).closest("img").attr("id");
                        $('#imgHidden').val(identifier);
                        if ($('#wrap_' + identifier).length)
                            $('#imgTarget').val($('#wrap_' + identifier).attr("href"));
                        else
                            $('#imgTarget').val('');
                    } else {
                        $(e.target).closest("img").attr("id", "img_" + stamp)
                        $('#imgHidden').val("img_" + stamp);
                    }

                }
            }(event));
            cMenuUl.append($('<li/>').append(modalTrigger))
                .append($('<li/>').append($('<a/>', {
                    text: "Remove Image"
                }).click(
                    function (e) {
                        return function () {
                            $('#context-menu').remove();
                            $(e.target).closest("img").remove();
                        }
                    }(event))));
        },

        createTableContext: function (event, cMenuUl) {
            $('#editProperties').remove();
            var modalId = "editProperties";
            var modalHeader = "Table Properties";
            var tblModalBody = methods.tableWidget.apply(this, ["edit"]);
            var onSave = function () {
                var tblWidthEdt = $('#tblWidthEdt').val();
                var tblHeightEdt = $('#tblHeightEdt').val();
                var tblBorderEdt = $('#tblBorderEdt').val();
                var tblAlignEdt = $('#tblAlignEdt').val();
                var tblCellspacingEdt = $('#tblCellspacingEdt').val();
                var tblCellpaddingEdt = $('#tblCellpaddingEdt').val();
                var tblEdtCssReg = /^auto$|^[+-]?[0-9]+\.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc)?$/ig;
                var tblEdtNumReg = /^[0-9]+\.?([0-9])?$/;
                if (tblWidthEdt != "" && !tblWidthEdt.match(tblEdtCssReg)) {
                    methods.showMessage.apply(this, ["tblErrMsgEdt", "Please enter positive number with or without a valid CSS measurement unit (px,em,ex,%,in,cm,mm,pt,pc)"]);
                    return false;
                }
                if (tblHeightEdt != "" && !tblHeightEdt.match(tblEdtCssReg)) {
                    methods.showMessage.apply(this, ["tblErrMsgEdt", "Please enter positive number with or without a valid CSS measurement unit (px,em,ex,%,in,cm,mm,pt,pc)"]);
                    return false;
                }
                if (tblBorderEdt != "" && !tblBorderEdt.match(tblEdtNumReg)) {
                    methods.showMessage.apply(this, ["tblErrMsgEdt", "Border size must be a positive number"]);
                    return false;
                }
                if (tblCellspacingEdt != "" && !tblCellspacingEdt.match(tblEdtNumReg)) {
                    methods.showMessage.apply(this, ["tblErrMsgEdt", "Cell spacing must be a positive number"]);
                    return false;
                }
                if (tblCellpaddingEdt != "" && !tblCellpaddingEdt.match(tblEdtNumReg)) {
                    methods.showMessage.apply(this, ["tblErrMsgEdt", "Cell padding must be a positive number"]);
                    return false;
                }
                $(event.target).closest('table').css('width', tblWidthEdt);
                if (tblHeightEdt != "")
                    $(event.target).closest('table').css('height', tblHeightEdt);
                $(event.target).closest('table').attr('align', tblAlignEdt);
                $(event.target).closest('table').attr('border', tblBorderEdt);
                $(event.target).closest('table').attr('cellspacing', tblCellspacingEdt);
                $(event.target).closest('table').attr('cellpadding', tblCellpaddingEdt);
                $("#editProperties").modal("hide");
                $('#contentarea').focus();
            };
            methods.createModal.apply(this, [modalId, modalHeader, tblModalBody, onSave]);
            var modalTrigger = $('<a/>', {
                href: "#" + modalId,
                "text": "Table Properties",
                "data-toggle": "modal"
            }).click(function (e) {
                return function () {
                    $('#context-menu').remove();
                    $('#tblRowsEdt').val($(e.target).closest('table').prop('rows').length);
                    $('#tblColumnsEdt').val($(e.target).closest('table').find('tr')[0].cells.length);
                    $('#tblRowsEdt').attr('disabled', 'disabled');
                    $('#tblColumnsEdt').attr('disabled', 'disabled');
                    $('#tblWidthEdt').val($(e.target).closest('table').get(0).style.width);
                    $('#tblHeightEdt').val($(e.target).closest('table').get(0).style.height);
                    $('#tblAlignEdt').val($(e.target).closest('table').attr("align"));
                    $('#tblBorderEdt').val($(e.target).closest('table').attr("border"));
                    $('#tblCellspacingEdt').val($(e.target).closest('table').attr("cellspacing"));
                    $('#tblCellpaddingEdt').val($(e.target).closest('table').attr("cellpadding"));


                }
            }(event));

            cMenuUl.append($('<li/>', {
                    class: "dropdown-submenu",
                    css: {
                        display: "block"
                    }
                })
                .append($('<a/>', {
                    "tabindex": "-1",
                    href: "javascript:void(0)",
                    "text": "Row"
                }))
                .append($('<ul/>', {
                        class: "dropdown-menu"
                    })
                    .append($('<li/>').append($('<a/>', {
                        id: "tbl_addrow",
                        "href": "javascript:void(0)",
                        "text": "Add Row"
                    }).click(function (e) {
                        return function () {
                            var row = $(e.target).closest('table').prop('rows').length;
                            var columns = $(e.target).closest('table').find('tr')[0].cells.length;
                            var newTblRow = $('<tr/>');
                            for (var j = 1; j <= columns; j++) {
                                var newTblCol = $('<td/>').html('&nbsp;');
                                newTblCol.appendTo(newTblRow);
                            }
                            newTblRow.appendTo($(e.target).closest('table'));
                            $('#context-menu').remove();
                        }
                    }(event))))
                    .append($('<li/>').append($('<a/>', {
                        text: "Remove Row"
                    }).click(
                        function (e) {
                            return function () {
                                $('#context-menu').remove();
                                $(e.target).closest("tr").remove();
                            }
                        }(event))))
                )).append($('<li/>', {
                    class: "dropdown-submenu",
                    css: {
                        display: "block"
                    }
                })
                .append($('<a/>', {
                    "tabindex": "-1",
                    href: "javascript:void(0)",
                    "text": "Column"
                }))
                .append($('<ul/>', {
                        class: "dropdown-menu"
                    })
                    .append($('<li/>').append($('<a/>', {
                        id: "tbl_addcolumn",
                        "href": "javascript:void(0)",
                        "text": "Add Column",
                    }).click(function (e) {
                        return function () {
                            var row = $(e.target).closest('table').prop('rows').length;
                            var columns = $(e.target).closest('table').find('tr')[0].cells.length;
                            $(e.target).closest('table').find('tr').each(function () {
                                $(this).append($('<td/>'));
                            });
                            $('#context-menu').remove();
                        }
                    }(event))))
                    .append($('<li/>').append($('<a/>', {
                        text: "Remove Column"
                    }).click(
                        function (e) {
                            return function () {
                                $('#context-menu').remove();
                                var colnum = $(e.target).closest("td").length;
                                $(e.target).closest("table").find("tr").each(function () {
                                    $(this).find("td:eq(" + colnum + ")").remove()
                                });
                            }
                        }(event))))
                ));
            cMenuUl.append($('<li/>').append(modalTrigger))
                .append($('<li/>', {
                    class: "divider"
                }))
                .append($('<li/>').append($('<a/>', {
                    text: "Remove Table"
                }).click(
                    function (e) {
                        return function () {
                            $('#context-menu').remove();
                            $(e.target).closest("table").remove();
                        }
                    }(event))));

        },

        createModal: function (modalId, modalHeader, modalBody, onSave) {
            //Create a Modal for the button.		
            var modalTrigger = $('<a/>', {
                href: "#" + modalId,
                role: "button",
                class: "btn btn-default",
                "data-toggle": "modal"
            });
            var modalElement = $('<div/>', {
                id: modalId,
                class: "modal fade",
                tabindex: "-1",
                role: "dialog",
                "aria-labelledby": "h3_" + modalId,
                "aria-hidden": "true"
            }).append($('<div>', {
                class: "modal-dialog"
            }).append($('<div>', {
                class: "modal-content"
            }).append($('<div>', {
                class: "modal-header"
            }).append($('<button/>', {
                type: "button",
                class: "close",
                "data-dismiss": "modal",
                "aria-hidden": "true"
            }).html('x')).append($('<h3/>', {
                id: "h3_" + modalId
            }).html(modalHeader))).append($('<div>', {
                class: "modal-body"
            }).append(modalBody)).append($('<div>', {
                class: "modal-footer"
            }).append($('<button/>', {
                type: "button",
                class: "btn btn-default",
                "data-dismiss": "modal",
                "aria-hidden": "true"
            }).html('Cancel')).append($('<button/>', {
                type: "button",
                class: "btn btn-success",
            }).html('Done').mousedown(function (e) {
                e.preventDefault();
            }).click(function (obj) {
                return function () {
                    onSave.apply(obj)
                }
            }(this))))));
            modalElement.appendTo("body");
            return modalTrigger;
        },

        createMenuItem: function (itemSettings, options, returnElement) {
            //Function to perform multiple actions.supplied arguments: itemsettings-list of buttons and button options, options: options for select input, returnelement: boolean.
            //1.Create Select Options using Bootstrap Dropdown.
            //2.Create modal dialog using bootstrap options
            //3.Create menubar buttons binded with corresponding event actions
            typeof returnElement !== 'undefined' ? returnElement : false;

            if (itemSettings["select"]) {
                var menuWrapElement = $("<div/>", {
                    class: "btn-group"
                });
                var menuElement = $("<ul/>", {
                    class: "dropdown-menu"
                });
                menuWrapElement.append($('<a/>', {
                    class: "btn btn-default dropdown-toggle",
                    "data-toggle": "dropdown",
                    "href": "javascript:void(0)",
                    "title": itemSettings["tooltip"]
                }).html(itemSettings["default"]).append($("<span/>", {
                    class: "caret"
                })).mousedown(function (e) {
                    e.preventDefault();
                }));
                $.each(options, function (i, v) {
                    var option = $('<li/>')
                    $("<a/>", {
                        tabindex: "-1",
                        href: "javascript:void(0)"
                    }).html(i).appendTo(option);

                    option.click(function () {
                        $(this).parent().parent().data("value", v);
                        $(this).parent().parent().trigger("change")
                    });
                    menuElement.append(option);
                });
                var action = "change";
            } else if (itemSettings["modal"]) {
                var menuWrapElement = methods.createModal.apply(this, [itemSettings["modalId"], itemSettings["modalHeader"], itemSettings["modalBody"], itemSettings["onSave"]]);
                var menuElement = $("<i/>");
                if (itemSettings["icon"])
                    menuElement.addClass(itemSettings["icon"]);
                else
                    menuElement.html(itemSettings["text"]);
                menuWrapElement.append(menuElement);
                menuWrapElement.mousedown(function (obj, methods, beforeLoad) {
                    return function (e) {
                        e.preventDefault();
                        methods.saveSelection.apply(obj);
                        if (beforeLoad) {
                            beforeLoad.apply(obj);
                        }
                    }
                }(this, methods, itemSettings["beforeLoad"]));
                menuWrapElement.attr('title', itemSettings['tooltip']);
                return menuWrapElement;
            } else {
                var menuWrapElement = $("<a/>", {
                    href: 'javascript:void(0)',
                    class: 'btn btn-default'
                });
                var menuElement = $("<i/>");
                if (itemSettings["icon"])
                    menuElement.addClass(itemSettings["icon"]);
                else
                    menuElement.html(itemSettings["text"]);
                var action = "click";
            }
            if (itemSettings["custom"]) {
                menuWrapElement.bind(action, (function (obj, params) {
                    return function () {
                        methods.saveSelection.apply(obj);
                        itemSettings["custom"].apply(obj, [$(this), params]);
                    }
                })(this, itemSettings['params']));
            } else {
                menuWrapElement.data("commandName", itemSettings["commandname"]);
                menuWrapElement.data("editor", $(this).data("editor"));
                menuWrapElement.bind(action, function () {
                    methods.setTextFormat.apply(this)
                });
            }
            menuWrapElement.attr('title', itemSettings['tooltip']);
            menuWrapElement.css('cursor', 'pointer');
            menuWrapElement.append(menuElement);
            if (returnElement)
                return menuWrapElement;
            $(this).data("menuBar").append(menuWrapElement);
        },

        setTextFormat: function () {
            //Function to run the text formatting options using execCommand.
            methods.setStyleWithCSS.apply(this);
            document.execCommand($(this).data("commandName"), false, $(this).data("value") || null);
            $(this).data("editor").focus();
            return false;
        },

        getSource: function (button, params) {
            //Function to show the html source code to the editor and toggle the text display.
            var flag = 0;
            if (button.data('state')) {
                flag = 1;
                button.data('state', null);
            } else
                button.data('state', 1);
            var editor = $(this).data('editor');
            var content;
            if (flag == 0) { //Convert text to HTML			
                content = document.createTextNode(editor.html());
                editor.empty();
                editor.attr('contenteditable', false);
                preElement = $("<pre/>", {
                    contenteditable: true
                });
                preElement.append(content);
                editor.append(preElement);
                button.parent().siblings().hide();
                button.siblings().hide();
            } else {
                var html = '';
                ch = editor.find(">:first-child").contents().filter(function () {
                    return (this.nodeType == 3);
                });
                ch = ch[0];
                if (typeof ch != 'undefined') {
                    html = ch.textContent;
                }
                editor.html(html);
                editor.attr('contenteditable', true);
                button.parent().siblings().show();
                button.siblings().show();
            }
        },

        countWords: function (node) {
            //Function to count the number of words recursively as the text grows in the editor.
            var count = 0
            var textNodes = node.contents().filter(function () {
                return (this.nodeType == 3);
            });
            for (var index = 0; index < textNodes.length; index++) {
                text = textNodes[index].textContent;
                text = text.replace(/[^-\w\s]/gi, ' ');
                text = $.trim(text);
                count = count + text.split(/\s+/).length;
            }
            var childNodes = node.children().each(function () {
                count = count + methods.countWords.apply(this, [$(this)]);
            });
            return count
        },

        getWordCount: function () {
            //Function to return the word count of the text in the editor
            return methods.countWords.apply(this, [$('#contentarea')]);
        },

        rgbToHex: function (rgb) {
            //Function to convert the rgb color codes into hexadecimal code
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            return "#" +
                ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2);
        },

        showMessage: function (target, message) {
            //Function to show the error message. Supplied arguments:target-div id, message-message text to be displayed.
            var errorDiv = $('<div/>', {
                class: "alert alert-danger"
            }).append($('<button/>', {
                type: "button",
                class: "close",
                "data-dismiss": "alert",
                html: "x"
            })).append($('<span/>').html(message));
            errorDiv.appendTo($('#' + target));
            setTimeout(function () {
                $('.alert').alert('close');
            }, 3000);
        },

        getText: function () {
            //Function to get the source code.
            var src = $($(this).parent()).find("#contentarea").html();
            return src;
        },

        setText: function (text) {
            //Function to set the source code
            $($(this).parent()).find("#contentarea").html(text);
        },

        setStyleWithCSS: function () {
            if (navigator.userAgent.match(/MSIE/i)) { //for IE10
                try {
                    Editor.execCommand("styleWithCSS", 0, false);
                } catch (e) {
                    try {
                        Editor.execCommand("useCSS", 0, true);
                    } catch (e) {
                        try {
                            Editor.execCommand('styleWithCSS', false, false);
                        } catch (e) {}
                    }
                }
            } else {
                document.execCommand("styleWithCSS", null, true);
            }
        },

    }

    $.fn.Editor = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.Editor');
        }
    };
})(jQuery);
/*!
 * Datepicker for Bootstrap v1.6.4 (https://github.com/eternicode/bootstrap-datepicker)
 *
 * Copyright 2012 Stefan Petre
 * Improvements by Andrew Rowls
 * Licensed under the Apache License v2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 */
(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($, undefined) {

    function UTCDate() {
        return new Date(Date.UTC.apply(Date, arguments));
    }

    function UTCToday() {
        var today = new Date();
        return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
    }

    function isUTCEquals(date1, date2) {
        return (
            date1.getUTCFullYear() === date2.getUTCFullYear() &&
            date1.getUTCMonth() === date2.getUTCMonth() &&
            date1.getUTCDate() === date2.getUTCDate()
        );
    }

    function alias(method) {
        return function () {
            return this[method].apply(this, arguments);
        };
    }

    function isValidDate(d) {
        return d && !isNaN(d.getTime());
    }

    var DateArray = (function () {
        var extras = {
            get: function (i) {
                return this.slice(i)[0];
            },
            contains: function (d) {
                // Array.indexOf is not cross-browser;
                // $.inArray doesn't work with Dates
                var val = d && d.valueOf();
                for (var i = 0, l = this.length; i < l; i++)
                    if (this[i].valueOf() === val)
                        return i;
                return -1;
            },
            remove: function (i) {
                this.splice(i, 1);
            },
            replace: function (new_array) {
                if (!new_array)
                    return;
                if (!$.isArray(new_array))
                    new_array = [new_array];
                this.clear();
                this.push.apply(this, new_array);
            },
            clear: function () {
                this.length = 0;
            },
            copy: function () {
                var a = new DateArray();
                a.replace(this);
                return a;
            }
        };

        return function () {
            var a = [];
            a.push.apply(a, arguments);
            $.extend(a, extras);
            return a;
        };
    })();


    // Picker object

    var Datepicker = function (element, options) {
        $(element).data('datepicker', this);
        this._process_options(options);

        this.dates = new DateArray();
        this.viewDate = this.o.defaultViewDate;
        this.focusDate = null;

        this.element = $(element);
        this.isInput = this.element.is('input');
        this.inputField = this.isInput ? this.element : this.element.find('input');
        this.component = this.element.hasClass('date') ? this.element.find('.add-on, .input-group-addon, .btn') : false;
        this.hasInput = this.component && this.inputField.length;
        if (this.component && this.component.length === 0)
            this.component = false;
        this.isInline = !this.component && this.element.is('div');

        this.picker = $(DPGlobal.template);

        // Checking templates and inserting
        if (this._check_template(this.o.templates.leftArrow)) {
            this.picker.find('.prev').html(this.o.templates.leftArrow);
        }
        if (this._check_template(this.o.templates.rightArrow)) {
            this.picker.find('.next').html(this.o.templates.rightArrow);
        }

        this._buildEvents();
        this._attachEvents();

        if (this.isInline) {
            this.picker.addClass('datepicker-inline').appendTo(this.element);
        } else {
            this.picker.addClass('datepicker-dropdown dropdown-menu');
        }

        if (this.o.rtl) {
            this.picker.addClass('datepicker-rtl');
        }

        this.viewMode = this.o.startView;

        if (this.o.calendarWeeks)
            this.picker.find('thead .datepicker-title, tfoot .today, tfoot .clear')
            .attr('colspan', function (i, val) {
                return parseInt(val) + 1;
            });

        this._allow_update = false;

        this.setStartDate(this._o.startDate);
        this.setEndDate(this._o.endDate);
        this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);
        this.setDaysOfWeekHighlighted(this.o.daysOfWeekHighlighted);
        this.setDatesDisabled(this.o.datesDisabled);

        this.fillDow();
        this.fillMonths();

        this._allow_update = true;

        this.update();
        this.showMode();

        if (this.isInline) {
            this.show();
        }
    };

    Datepicker.prototype = {
        constructor: Datepicker,

        _resolveViewName: function (view, default_value) {
            if (view === 0 || view === 'days' || view === 'month') {
                return 0;
            }
            if (view === 1 || view === 'months' || view === 'year') {
                return 1;
            }
            if (view === 2 || view === 'years' || view === 'decade') {
                return 2;
            }
            if (view === 3 || view === 'decades' || view === 'century') {
                return 3;
            }
            if (view === 4 || view === 'centuries' || view === 'millennium') {
                return 4;
            }
            return default_value === undefined ? false : default_value;
        },

        _check_template: function (tmp) {
            try {
                // If empty
                if (tmp === undefined || tmp === "") {
                    return false;
                }
                // If no html, everything ok
                if ((tmp.match(/[<>]/g) || []).length <= 0) {
                    return true;
                }
                // Checking if html is fine
                var jDom = $(tmp);
                return jDom.length > 0;
            } catch (ex) {
                return false;
            }
        },

        _process_options: function (opts) {
            // Store raw options for reference
            this._o = $.extend({}, this._o, opts);
            // Processed options
            var o = this.o = $.extend({}, this._o);

            // Check if "de-DE" style date is available, if not language should
            // fallback to 2 letter code eg "de"
            var lang = o.language;
            if (!dates[lang]) {
                lang = lang.split('-')[0];
                if (!dates[lang])
                    lang = defaults.language;
            }
            o.language = lang;

            // Retrieve view index from any aliases
            o.startView = this._resolveViewName(o.startView, 0);
            o.minViewMode = this._resolveViewName(o.minViewMode, 0);
            o.maxViewMode = this._resolveViewName(o.maxViewMode, 4);

            // Check that the start view is between min and max
            o.startView = Math.min(o.startView, o.maxViewMode);
            o.startView = Math.max(o.startView, o.minViewMode);

            // true, false, or Number > 0
            if (o.multidate !== true) {
                o.multidate = Number(o.multidate) || false;
                if (o.multidate !== false)
                    o.multidate = Math.max(0, o.multidate);
            }
            o.multidateSeparator = String(o.multidateSeparator);

            o.weekStart %= 7;
            o.weekEnd = (o.weekStart + 6) % 7;

            var format = DPGlobal.parseFormat(o.format);
            if (o.startDate !== -Infinity) {
                if (!!o.startDate) {
                    if (o.startDate instanceof Date)
                        o.startDate = this._local_to_utc(this._zero_time(o.startDate));
                    else
                        o.startDate = DPGlobal.parseDate(o.startDate, format, o.language, o.assumeNearbyYear);
                } else {
                    o.startDate = -Infinity;
                }
            }
            if (o.endDate !== Infinity) {
                if (!!o.endDate) {
                    if (o.endDate instanceof Date)
                        o.endDate = this._local_to_utc(this._zero_time(o.endDate));
                    else
                        o.endDate = DPGlobal.parseDate(o.endDate, format, o.language, o.assumeNearbyYear);
                } else {
                    o.endDate = Infinity;
                }
            }

            o.daysOfWeekDisabled = o.daysOfWeekDisabled || [];
            if (!$.isArray(o.daysOfWeekDisabled))
                o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
            o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function (d) {
                return parseInt(d, 10);
            });

            o.daysOfWeekHighlighted = o.daysOfWeekHighlighted || [];
            if (!$.isArray(o.daysOfWeekHighlighted))
                o.daysOfWeekHighlighted = o.daysOfWeekHighlighted.split(/[,\s]*/);
            o.daysOfWeekHighlighted = $.map(o.daysOfWeekHighlighted, function (d) {
                return parseInt(d, 10);
            });

            o.datesDisabled = o.datesDisabled || [];
            if (!$.isArray(o.datesDisabled)) {
                o.datesDisabled = [
					o.datesDisabled
				];
            }
            o.datesDisabled = $.map(o.datesDisabled, function (d) {
                return DPGlobal.parseDate(d, format, o.language, o.assumeNearbyYear);
            });

            var plc = String(o.orientation).toLowerCase().split(/\s+/g),
                _plc = o.orientation.toLowerCase();
            plc = $.grep(plc, function (word) {
                return /^auto|left|right|top|bottom$/.test(word);
            });
            o.orientation = {
                x: 'auto',
                y: 'auto'
            };
            if (!_plc || _plc === 'auto')
            ; // no action
            else if (plc.length === 1) {
                switch (plc[0]) {
                    case 'top':
                    case 'bottom':
                        o.orientation.y = plc[0];
                        break;
                    case 'left':
                    case 'right':
                        o.orientation.x = plc[0];
                        break;
                }
            } else {
                _plc = $.grep(plc, function (word) {
                    return /^left|right$/.test(word);
                });
                o.orientation.x = _plc[0] || 'auto';

                _plc = $.grep(plc, function (word) {
                    return /^top|bottom$/.test(word);
                });
                o.orientation.y = _plc[0] || 'auto';
            }
            if (o.defaultViewDate) {
                var year = o.defaultViewDate.year || new Date().getFullYear();
                var month = o.defaultViewDate.month || 0;
                var day = o.defaultViewDate.day || 1;
                o.defaultViewDate = UTCDate(year, month, day);
            } else {
                o.defaultViewDate = UTCToday();
            }
        },
        _events: [],
        _secondaryEvents: [],
        _applyEvents: function (evs) {
            for (var i = 0, el, ch, ev; i < evs.length; i++) {
                el = evs[i][0];
                if (evs[i].length === 2) {
                    ch = undefined;
                    ev = evs[i][1];
                } else if (evs[i].length === 3) {
                    ch = evs[i][1];
                    ev = evs[i][2];
                }
                el.on(ev, ch);
            }
        },
        _unapplyEvents: function (evs) {
            for (var i = 0, el, ev, ch; i < evs.length; i++) {
                el = evs[i][0];
                if (evs[i].length === 2) {
                    ch = undefined;
                    ev = evs[i][1];
                } else if (evs[i].length === 3) {
                    ch = evs[i][1];
                    ev = evs[i][2];
                }
                el.off(ev, ch);
            }
        },
        _buildEvents: function () {
            var events = {
                keyup: $.proxy(function (e) {
                    if ($.inArray(e.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1)
                        this.update();
                }, this),
                keydown: $.proxy(this.keydown, this),
                paste: $.proxy(this.paste, this)
            };

            if (this.o.showOnFocus === true) {
                events.focus = $.proxy(this.show, this);
            }

            if (this.isInput) { // single input
                this._events = [
                    [this.element, events]
                ];
            } else if (this.component && this.hasInput) { // component: input + button
                this._events = [
                    // For components that are not readonly, allow keyboard nav
                    [this.inputField, events],
                    [this.component, {
                        click: $.proxy(this.show, this)
                    }]
                ];
            } else {
                this._events = [
					[this.element, {
                        click: $.proxy(this.show, this),
                        keydown: $.proxy(this.keydown, this)
					}]
				];
            }
            this._events.push(
                // Component: listen for blur on element descendants
				[this.element, '*', {
                    blur: $.proxy(function (e) {
                        this._focused_from = e.target;
                    }, this)
				}],
                // Input: listen for blur on element
				[this.element, {
                    blur: $.proxy(function (e) {
                        this._focused_from = e.target;
                    }, this)
				}]
            );

            if (this.o.immediateUpdates) {
                // Trigger input updates immediately on changed year/month
                this._events.push([this.element, {
                    'changeYear changeMonth': $.proxy(function (e) {
                        this.update(e.date);
                    }, this)
				}]);
            }

            this._secondaryEvents = [
				[this.picker, {
                    click: $.proxy(this.click, this)
				}],
				[$(window), {
                    resize: $.proxy(this.place, this)
				}],
				[$(document), {
                    mousedown: $.proxy(function (e) {
                        // Clicked outside the datepicker, hide it
                        if (!(
                                this.element.is(e.target) ||
                                this.element.find(e.target).length ||
                                this.picker.is(e.target) ||
                                this.picker.find(e.target).length ||
                                this.isInline
                            )) {
                            this.hide();
                        }
                    }, this)
				}]
			];
        },
        _attachEvents: function () {
            this._detachEvents();
            this._applyEvents(this._events);
        },
        _detachEvents: function () {
            this._unapplyEvents(this._events);
        },
        _attachSecondaryEvents: function () {
            this._detachSecondaryEvents();
            this._applyEvents(this._secondaryEvents);
        },
        _detachSecondaryEvents: function () {
            this._unapplyEvents(this._secondaryEvents);
        },
        _trigger: function (event, altdate) {
            var date = altdate || this.dates.get(-1),
                local_date = this._utc_to_local(date);

            this.element.trigger({
                type: event,
                date: local_date,
                dates: $.map(this.dates, this._utc_to_local),
                format: $.proxy(function (ix, format) {
                    if (arguments.length === 0) {
                        ix = this.dates.length - 1;
                        format = this.o.format;
                    } else if (typeof ix === 'string') {
                        format = ix;
                        ix = this.dates.length - 1;
                    }
                    format = format || this.o.format;
                    var date = this.dates.get(ix);
                    return DPGlobal.formatDate(date, format, this.o.language);
                }, this)
            });
        },

        show: function () {
            if (this.inputField.prop('disabled') || (this.inputField.prop('readonly') && this.o.enableOnReadonly === false))
                return;
            if (!this.isInline)
                this.picker.appendTo(this.o.container);
            this.place();
            this.picker.show();
            this._attachSecondaryEvents();
            this._trigger('show');
            if ((window.navigator.msMaxTouchPoints || 'ontouchstart' in document) && this.o.disableTouchKeyboard) {
                $(this.element).blur();
            }
            return this;
        },

        hide: function () {
            if (this.isInline || !this.picker.is(':visible'))
                return this;
            this.focusDate = null;
            this.picker.hide().detach();
            this._detachSecondaryEvents();
            this.viewMode = this.o.startView;
            this.showMode();

            if (this.o.forceParse && this.inputField.val())
                this.setValue();
            this._trigger('hide');
            return this;
        },

        destroy: function () {
            this.hide();
            this._detachEvents();
            this._detachSecondaryEvents();
            this.picker.remove();
            delete this.element.data().datepicker;
            if (!this.isInput) {
                delete this.element.data().date;
            }
            return this;
        },

        paste: function (evt) {
            var dateString;
            if (evt.originalEvent.clipboardData && evt.originalEvent.clipboardData.types &&
                $.inArray('text/plain', evt.originalEvent.clipboardData.types) !== -1) {
                dateString = evt.originalEvent.clipboardData.getData('text/plain');
            } else if (window.clipboardData) {
                dateString = window.clipboardData.getData('Text');
            } else {
                return;
            }
            this.setDate(dateString);
            this.update();
            evt.preventDefault();
        },

        _utc_to_local: function (utc) {
            return utc && new Date(utc.getTime() + (utc.getTimezoneOffset() * 60000));
        },
        _local_to_utc: function (local) {
            return local && new Date(local.getTime() - (local.getTimezoneOffset() * 60000));
        },
        _zero_time: function (local) {
            return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
        },
        _zero_utc_time: function (utc) {
            return utc && new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
        },

        getDates: function () {
            return $.map(this.dates, this._utc_to_local);
        },

        getUTCDates: function () {
            return $.map(this.dates, function (d) {
                return new Date(d);
            });
        },

        getDate: function () {
            return this._utc_to_local(this.getUTCDate());
        },

        getUTCDate: function () {
            var selected_date = this.dates.get(-1);
            if (typeof selected_date !== 'undefined') {
                return new Date(selected_date);
            } else {
                return null;
            }
        },

        clearDates: function () {
            if (this.inputField) {
                this.inputField.val('');
            }

            this.update();
            this._trigger('changeDate');

            if (this.o.autoclose) {
                this.hide();
            }
        },
        setDates: function () {
            var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
            this.update.apply(this, args);
            this._trigger('changeDate');
            this.setValue();
            return this;
        },

        setUTCDates: function () {
            var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
            this.update.apply(this, $.map(args, this._utc_to_local));
            this._trigger('changeDate');
            this.setValue();
            return this;
        },

        setDate: alias('setDates'),
        setUTCDate: alias('setUTCDates'),
        remove: alias('destroy'),

        setValue: function () {
            var formatted = this.getFormattedDate();
            this.inputField.val(formatted);
            return this;
        },

        getFormattedDate: function (format) {
            if (format === undefined)
                format = this.o.format;

            var lang = this.o.language;
            return $.map(this.dates, function (d) {
                return DPGlobal.formatDate(d, format, lang);
            }).join(this.o.multidateSeparator);
        },

        getStartDate: function () {
            return this.o.startDate;
        },

        setStartDate: function (startDate) {
            this._process_options({
                startDate: startDate
            });
            this.update();
            this.updateNavArrows();
            return this;
        },

        getEndDate: function () {
            return this.o.endDate;
        },

        setEndDate: function (endDate) {
            this._process_options({
                endDate: endDate
            });
            this.update();
            this.updateNavArrows();
            return this;
        },

        setDaysOfWeekDisabled: function (daysOfWeekDisabled) {
            this._process_options({
                daysOfWeekDisabled: daysOfWeekDisabled
            });
            this.update();
            this.updateNavArrows();
            return this;
        },

        setDaysOfWeekHighlighted: function (daysOfWeekHighlighted) {
            this._process_options({
                daysOfWeekHighlighted: daysOfWeekHighlighted
            });
            this.update();
            return this;
        },

        setDatesDisabled: function (datesDisabled) {
            this._process_options({
                datesDisabled: datesDisabled
            });
            this.update();
            this.updateNavArrows();
        },

        place: function () {
            if (this.isInline)
                return this;
            var calendarWidth = this.picker.outerWidth(),
                calendarHeight = this.picker.outerHeight(),
                visualPadding = 10,
                container = $(this.o.container),
                windowWidth = container.width(),
                scrollTop = this.o.container === 'body' ? $(document).scrollTop() : container.scrollTop(),
                appendOffset = container.offset();

            var parentsZindex = [];
            this.element.parents().each(function () {
                var itemZIndex = $(this).css('z-index');
                if (itemZIndex !== 'auto' && itemZIndex !== 0) parentsZindex.push(parseInt(itemZIndex));
            });
            var zIndex = Math.max.apply(Math, parentsZindex) + this.o.zIndexOffset;
            var offset = this.component ? this.component.parent().offset() : this.element.offset();
            var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
            var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
            var left = offset.left - appendOffset.left,
                top = offset.top - appendOffset.top;

            if (this.o.container !== 'body') {
                top += scrollTop;
            }

            this.picker.removeClass(
                'datepicker-orient-top datepicker-orient-bottom ' +
                'datepicker-orient-right datepicker-orient-left'
            );

            if (this.o.orientation.x !== 'auto') {
                this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
                if (this.o.orientation.x === 'right')
                    left -= calendarWidth - width;
            }
            // auto x orientation is best-placement: if it crosses a window
            // edge, fudge it sideways
            else {
                if (offset.left < 0) {
                    // component is outside the window on the left side. Move it into visible range
                    this.picker.addClass('datepicker-orient-left');
                    left -= offset.left - visualPadding;
                } else if (left + calendarWidth > windowWidth) {
                    // the calendar passes the widow right edge. Align it to component right side
                    this.picker.addClass('datepicker-orient-right');
                    left += width - calendarWidth;
                } else {
                    // Default to left
                    this.picker.addClass('datepicker-orient-left');
                }
            }

            // auto y orientation is best-situation: top or bottom, no fudging,
            // decision based on which shows more of the calendar
            var yorient = this.o.orientation.y,
                top_overflow;
            if (yorient === 'auto') {
                top_overflow = -scrollTop + top - calendarHeight;
                yorient = top_overflow < 0 ? 'bottom' : 'top';
            }

            this.picker.addClass('datepicker-orient-' + yorient);
            if (yorient === 'top')
                top -= calendarHeight + parseInt(this.picker.css('padding-top'));
            else
                top += height;

            if (this.o.rtl) {
                var right = windowWidth - (left + width);
                this.picker.css({
                    top: top,
                    right: right,
                    zIndex: zIndex
                });
            } else {
                this.picker.css({
                    top: top,
                    left: left,
                    zIndex: zIndex
                });
            }
            return this;
        },

        _allow_update: true,
        update: function () {
            if (!this._allow_update)
                return this;

            var oldDates = this.dates.copy(),
                dates = [],
                fromArgs = false;
            if (arguments.length) {
                $.each(arguments, $.proxy(function (i, date) {
                    if (date instanceof Date)
                        date = this._local_to_utc(date);
                    dates.push(date);
                }, this));
                fromArgs = true;
            } else {
                dates = this.isInput ?
                    this.element.val() :
                    this.element.data('date') || this.inputField.val();
                if (dates && this.o.multidate)
                    dates = dates.split(this.o.multidateSeparator);
                else
                    dates = [dates];
                delete this.element.data().date;
            }

            dates = $.map(dates, $.proxy(function (date) {
                return DPGlobal.parseDate(date, this.o.format, this.o.language, this.o.assumeNearbyYear);
            }, this));
            dates = $.grep(dates, $.proxy(function (date) {
                return (
                    !this.dateWithinRange(date) ||
                    !date
                );
            }, this), true);
            this.dates.replace(dates);

            if (this.dates.length)
                this.viewDate = new Date(this.dates.get(-1));
            else if (this.viewDate < this.o.startDate)
                this.viewDate = new Date(this.o.startDate);
            else if (this.viewDate > this.o.endDate)
                this.viewDate = new Date(this.o.endDate);
            else
                this.viewDate = this.o.defaultViewDate;

            if (fromArgs) {
                // setting date by clicking
                this.setValue();
            } else if (dates.length) {
                // setting date by typing
                if (String(oldDates) !== String(this.dates))
                    this._trigger('changeDate');
            }
            if (!this.dates.length && oldDates.length)
                this._trigger('clearDate');

            this.fill();
            this.element.change();
            return this;
        },

        fillDow: function () {
            var dowCnt = this.o.weekStart,
                html = '<tr>';
            if (this.o.calendarWeeks) {
                this.picker.find('.datepicker-days .datepicker-switch')
                    .attr('colspan', function (i, val) {
                        return parseInt(val) + 1;
                    });
                html += '<th class="cw">&#160;</th>';
            }
            while (dowCnt < this.o.weekStart + 7) {
                html += '<th class="dow';
                if ($.inArray(dowCnt, this.o.daysOfWeekDisabled) > -1)
                    html += ' disabled';
                html += '">' + dates[this.o.language].daysMin[(dowCnt++) % 7] + '</th>';
            }
            html += '</tr>';
            this.picker.find('.datepicker-days thead').append(html);
        },

        fillMonths: function () {
            var localDate = this._utc_to_local(this.viewDate);
            var html = '',
                i = 0;
            while (i < 12) {
                var focused = localDate && localDate.getMonth() === i ? ' focused' : '';
                html += '<span class="month' + focused + '">' + dates[this.o.language].monthsShort[i++] + '</span>';
            }
            this.picker.find('.datepicker-months td').html(html);
        },

        setRange: function (range) {
            if (!range || !range.length)
                delete this.range;
            else
                this.range = $.map(range, function (d) {
                    return d.valueOf();
                });
            this.fill();
        },

        getClassNames: function (date) {
            var cls = [],
                year = this.viewDate.getUTCFullYear(),
                month = this.viewDate.getUTCMonth(),
                today = new Date();
            if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)) {
                cls.push('old');
            } else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)) {
                cls.push('new');
            }
            if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
                cls.push('focused');
            // Compare internal UTC date with local today, not UTC today
            if (this.o.todayHighlight &&
                date.getUTCFullYear() === today.getFullYear() &&
                date.getUTCMonth() === today.getMonth() &&
                date.getUTCDate() === today.getDate()) {
                cls.push('today');
            }
            if (this.dates.contains(date) !== -1)
                cls.push('active');
            if (!this.dateWithinRange(date)) {
                cls.push('disabled');
            }
            if (this.dateIsDisabled(date)) {
                cls.push('disabled', 'disabled-date');
            }
            if ($.inArray(date.getUTCDay(), this.o.daysOfWeekHighlighted) !== -1) {
                cls.push('highlighted');
            }

            if (this.range) {
                if (date > this.range[0] && date < this.range[this.range.length - 1]) {
                    cls.push('range');
                }
                if ($.inArray(date.valueOf(), this.range) !== -1) {
                    cls.push('selected');
                }
                if (date.valueOf() === this.range[0]) {
                    cls.push('range-start');
                }
                if (date.valueOf() === this.range[this.range.length - 1]) {
                    cls.push('range-end');
                }
            }
            return cls;
        },

        _fill_yearsView: function (selector, cssClass, factor, step, currentYear, startYear, endYear, callback) {
            var html, view, year, steps, startStep, endStep, thisYear, i, classes, tooltip, before;

            html = '';
            view = this.picker.find(selector);
            year = parseInt(currentYear / factor, 10) * factor;
            startStep = parseInt(startYear / step, 10) * step;
            endStep = parseInt(endYear / step, 10) * step;
            steps = $.map(this.dates, function (d) {
                return parseInt(d.getUTCFullYear() / step, 10) * step;
            });

            view.find('.datepicker-switch').text(year + '-' + (year + step * 9));

            thisYear = year - step;
            for (i = -1; i < 11; i += 1) {
                classes = [cssClass];
                tooltip = null;

                if (i === -1) {
                    classes.push('old');
                } else if (i === 10) {
                    classes.push('new');
                }
                if ($.inArray(thisYear, steps) !== -1) {
                    classes.push('active');
                }
                if (thisYear < startStep || thisYear > endStep) {
                    classes.push('disabled');
                }
                if (thisYear === this.viewDate.getFullYear()) {
                    classes.push('focused');
                }

                if (callback !== $.noop) {
                    before = callback(new Date(thisYear, 0, 1));
                    if (before === undefined) {
                        before = {};
                    } else if (typeof (before) === 'boolean') {
                        before = {
                            enabled: before
                        };
                    } else if (typeof (before) === 'string') {
                        before = {
                            classes: before
                        };
                    }
                    if (before.enabled === false) {
                        classes.push('disabled');
                    }
                    if (before.classes) {
                        classes = classes.concat(before.classes.split(/\s+/));
                    }
                    if (before.tooltip) {
                        tooltip = before.tooltip;
                    }
                }

                html += '<span class="' + classes.join(' ') + '"' + (tooltip ? ' title="' + tooltip + '"' : '') + '>' + thisYear + '</span>';
                thisYear += step;
            }
            view.find('td').html(html);
        },

        fill: function () {
            var d = new Date(this.viewDate),
                year = d.getUTCFullYear(),
                month = d.getUTCMonth(),
                startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
                startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
                endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
                endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
                todaytxt = dates[this.o.language].today || dates['en'].today || '',
                cleartxt = dates[this.o.language].clear || dates['en'].clear || '',
                titleFormat = dates[this.o.language].titleFormat || dates['en'].titleFormat,
                tooltip,
                before;
            if (isNaN(year) || isNaN(month))
                return;
            this.picker.find('.datepicker-days .datepicker-switch')
                .text(DPGlobal.formatDate(d, titleFormat, this.o.language));
            this.picker.find('tfoot .today')
                .text(todaytxt)
                .toggle(this.o.todayBtn !== false);
            this.picker.find('tfoot .clear')
                .text(cleartxt)
                .toggle(this.o.clearBtn !== false);
            this.picker.find('thead .datepicker-title')
                .text(this.o.title)
                .toggle(this.o.title !== '');
            this.updateNavArrows();
            this.fillMonths();
            var prevMonth = UTCDate(year, month - 1, 28),
                day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
            prevMonth.setUTCDate(day);
            prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7) % 7);
            var nextMonth = new Date(prevMonth);
            if (prevMonth.getUTCFullYear() < 100) {
                nextMonth.setUTCFullYear(prevMonth.getUTCFullYear());
            }
            nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
            nextMonth = nextMonth.valueOf();
            var html = [];
            var clsName;
            while (prevMonth.valueOf() < nextMonth) {
                if (prevMonth.getUTCDay() === this.o.weekStart) {
                    html.push('<tr>');
                    if (this.o.calendarWeeks) {
                        // ISO 8601: First week contains first thursday.
                        // ISO also states week starts on Monday, but we can be more abstract here.
                        var
                            // Start of current week: based on weekstart/current date
                            ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
                            // Thursday of this week
                            th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
                            // First Thursday of year, year from thursday
                            yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay()) % 7 * 864e5),
                            // Calendar week: ms between thursdays, div ms per day, div 7 days
                            calWeek = (th - yth) / 864e5 / 7 + 1;
                        html.push('<td class="cw">' + calWeek + '</td>');
                    }
                }
                clsName = this.getClassNames(prevMonth);
                clsName.push('day');

                if (this.o.beforeShowDay !== $.noop) {
                    before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
                    if (before === undefined)
                        before = {};
                    else if (typeof (before) === 'boolean')
                        before = {
                            enabled: before
                        };
                    else if (typeof (before) === 'string')
                        before = {
                            classes: before
                        };
                    if (before.enabled === false)
                        clsName.push('disabled');
                    if (before.classes)
                        clsName = clsName.concat(before.classes.split(/\s+/));
                    if (before.tooltip)
                        tooltip = before.tooltip;
                }

                //Check if uniqueSort exists (supported by jquery >=1.12 and >=2.2)
                //Fallback to unique function for older jquery versions
                if ($.isFunction($.uniqueSort)) {
                    clsName = $.uniqueSort(clsName);
                } else {
                    clsName = $.unique(clsName);
                }

                html.push('<td class="' + clsName.join(' ') + '"' + (tooltip ? ' title="' + tooltip + '"' : '') + '>' + prevMonth.getUTCDate() + '</td>');
                tooltip = null;
                if (prevMonth.getUTCDay() === this.o.weekEnd) {
                    html.push('</tr>');
                }
                prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
            }
            this.picker.find('.datepicker-days tbody').empty().append(html.join(''));

            var monthsTitle = dates[this.o.language].monthsTitle || dates['en'].monthsTitle || 'Months';
            var months = this.picker.find('.datepicker-months')
                .find('.datepicker-switch')
                .text(this.o.maxViewMode < 2 ? monthsTitle : year)
                .end()
                .find('span').removeClass('active');

            $.each(this.dates, function (i, d) {
                if (d.getUTCFullYear() === year)
                    months.eq(d.getUTCMonth()).addClass('active');
            });

            if (year < startYear || year > endYear) {
                months.addClass('disabled');
            }
            if (year === startYear) {
                months.slice(0, startMonth).addClass('disabled');
            }
            if (year === endYear) {
                months.slice(endMonth + 1).addClass('disabled');
            }

            if (this.o.beforeShowMonth !== $.noop) {
                var that = this;
                $.each(months, function (i, month) {
                    var moDate = new Date(year, i, 1);
                    var before = that.o.beforeShowMonth(moDate);
                    if (before === undefined)
                        before = {};
                    else if (typeof (before) === 'boolean')
                        before = {
                            enabled: before
                        };
                    else if (typeof (before) === 'string')
                        before = {
                            classes: before
                        };
                    if (before.enabled === false && !$(month).hasClass('disabled'))
                        $(month).addClass('disabled');
                    if (before.classes)
                        $(month).addClass(before.classes);
                    if (before.tooltip)
                        $(month).prop('title', before.tooltip);
                });
            }

            // Generating decade/years picker
            this._fill_yearsView(
                '.datepicker-years',
                'year',
                10,
                1,
                year,
                startYear,
                endYear,
                this.o.beforeShowYear
            );

            // Generating century/decades picker
            this._fill_yearsView(
                '.datepicker-decades',
                'decade',
                100,
                10,
                year,
                startYear,
                endYear,
                this.o.beforeShowDecade
            );

            // Generating millennium/centuries picker
            this._fill_yearsView(
                '.datepicker-centuries',
                'century',
                1000,
                100,
                year,
                startYear,
                endYear,
                this.o.beforeShowCentury
            );
        },

        updateNavArrows: function () {
            if (!this._allow_update)
                return;

            var d = new Date(this.viewDate),
                year = d.getUTCFullYear(),
                month = d.getUTCMonth();
            switch (this.viewMode) {
                case 0:
                    if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()) {
                        this.picker.find('.prev').css({
                            visibility: 'hidden'
                        });
                    } else {
                        this.picker.find('.prev').css({
                            visibility: 'visible'
                        });
                    }
                    if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()) {
                        this.picker.find('.next').css({
                            visibility: 'hidden'
                        });
                    } else {
                        this.picker.find('.next').css({
                            visibility: 'visible'
                        });
                    }
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                    if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() || this.o.maxViewMode < 2) {
                        this.picker.find('.prev').css({
                            visibility: 'hidden'
                        });
                    } else {
                        this.picker.find('.prev').css({
                            visibility: 'visible'
                        });
                    }
                    if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() || this.o.maxViewMode < 2) {
                        this.picker.find('.next').css({
                            visibility: 'hidden'
                        });
                    } else {
                        this.picker.find('.next').css({
                            visibility: 'visible'
                        });
                    }
                    break;
            }
        },

        click: function (e) {
            e.preventDefault();
            e.stopPropagation();

            var target, dir, day, year, month, monthChanged, yearChanged;
            target = $(e.target);

            // Clicked on the switch
            if (target.hasClass('datepicker-switch')) {
                this.showMode(1);
            }

            // Clicked on prev or next
            var navArrow = target.closest('.prev, .next');
            if (navArrow.length > 0) {
                dir = DPGlobal.modes[this.viewMode].navStep * (navArrow.hasClass('prev') ? -1 : 1);
                if (this.viewMode === 0) {
                    this.viewDate = this.moveMonth(this.viewDate, dir);
                    this._trigger('changeMonth', this.viewDate);
                } else {
                    this.viewDate = this.moveYear(this.viewDate, dir);
                    if (this.viewMode === 1) {
                        this._trigger('changeYear', this.viewDate);
                    }
                }
                this.fill();
            }

            // Clicked on today button
            if (target.hasClass('today') && !target.hasClass('day')) {
                this.showMode(-2);
                this._setDate(UTCToday(), this.o.todayBtn === 'linked' ? null : 'view');
            }

            // Clicked on clear button
            if (target.hasClass('clear')) {
                this.clearDates();
            }

            if (!target.hasClass('disabled')) {
                // Clicked on a day
                if (target.hasClass('day')) {
                    day = parseInt(target.text(), 10) || 1;
                    year = this.viewDate.getUTCFullYear();
                    month = this.viewDate.getUTCMonth();

                    // From last month
                    if (target.hasClass('old')) {
                        if (month === 0) {
                            month = 11;
                            year = year - 1;
                            monthChanged = true;
                            yearChanged = true;
                        } else {
                            month = month - 1;
                            monthChanged = true;
                        }
                    }

                    // From next month
                    if (target.hasClass('new')) {
                        if (month === 11) {
                            month = 0;
                            year = year + 1;
                            monthChanged = true;
                            yearChanged = true;
                        } else {
                            month = month + 1;
                            monthChanged = true;
                        }
                    }
                    this._setDate(UTCDate(year, month, day));
                    if (yearChanged) {
                        this._trigger('changeYear', this.viewDate);
                    }
                    if (monthChanged) {
                        this._trigger('changeMonth', this.viewDate);
                    }
                }

                // Clicked on a month
                if (target.hasClass('month')) {
                    this.viewDate.setUTCDate(1);
                    day = 1;
                    month = target.parent().find('span').index(target);
                    year = this.viewDate.getUTCFullYear();
                    this.viewDate.setUTCMonth(month);
                    this._trigger('changeMonth', this.viewDate);
                    if (this.o.minViewMode === 1) {
                        this._setDate(UTCDate(year, month, day));
                        this.showMode();
                    } else {
                        this.showMode(-1);
                    }
                    this.fill();
                }

                // Clicked on a year
                if (target.hasClass('year') ||
                    target.hasClass('decade') ||
                    target.hasClass('century')) {
                    this.viewDate.setUTCDate(1);

                    day = 1;
                    month = 0;
                    year = parseInt(target.text(), 10) || 0;
                    this.viewDate.setUTCFullYear(year);

                    if (target.hasClass('year')) {
                        this._trigger('changeYear', this.viewDate);
                        if (this.o.minViewMode === 2) {
                            this._setDate(UTCDate(year, month, day));
                        }
                    }
                    if (target.hasClass('decade')) {
                        this._trigger('changeDecade', this.viewDate);
                        if (this.o.minViewMode === 3) {
                            this._setDate(UTCDate(year, month, day));
                        }
                    }
                    if (target.hasClass('century')) {
                        this._trigger('changeCentury', this.viewDate);
                        if (this.o.minViewMode === 4) {
                            this._setDate(UTCDate(year, month, day));
                        }
                    }

                    this.showMode(-1);
                    this.fill();
                }
            }

            if (this.picker.is(':visible') && this._focused_from) {
                $(this._focused_from).focus();
            }
            delete this._focused_from;
        },

        _toggle_multidate: function (date) {
            var ix = this.dates.contains(date);
            if (!date) {
                this.dates.clear();
            }

            if (ix !== -1) {
                if (this.o.multidate === true || this.o.multidate > 1 || this.o.toggleActive) {
                    this.dates.remove(ix);
                }
            } else if (this.o.multidate === false) {
                this.dates.clear();
                this.dates.push(date);
            } else {
                this.dates.push(date);
            }

            if (typeof this.o.multidate === 'number')
                while (this.dates.length > this.o.multidate)
                    this.dates.remove(0);
        },

        _setDate: function (date, which) {
            if (!which || which === 'date')
                this._toggle_multidate(date && new Date(date));
            if (!which || which === 'view')
                this.viewDate = date && new Date(date);

            this.fill();
            this.setValue();
            if (!which || which !== 'view') {
                this._trigger('changeDate');
            }
            if (this.inputField) {
                this.inputField.change();
            }
            if (this.o.autoclose && (!which || which === 'date')) {
                this.hide();
            }
        },

        moveDay: function (date, dir) {
            var newDate = new Date(date);
            newDate.setUTCDate(date.getUTCDate() + dir);

            return newDate;
        },

        moveWeek: function (date, dir) {
            return this.moveDay(date, dir * 7);
        },

        moveMonth: function (date, dir) {
            if (!isValidDate(date))
                return this.o.defaultViewDate;
            if (!dir)
                return date;
            var new_date = new Date(date.valueOf()),
                day = new_date.getUTCDate(),
                month = new_date.getUTCMonth(),
                mag = Math.abs(dir),
                new_month, test;
            dir = dir > 0 ? 1 : -1;
            if (mag === 1) {
                test = dir === -1
                    // If going back one month, make sure month is not current month
                    // (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
                    ?
                    function () {
                        return new_date.getUTCMonth() === month;
                    }
                    // If going forward one month, make sure month is as expected
                    // (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
                    :
                    function () {
                        return new_date.getUTCMonth() !== new_month;
                    };
                new_month = month + dir;
                new_date.setUTCMonth(new_month);
                // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
                if (new_month < 0 || new_month > 11)
                    new_month = (new_month + 12) % 12;
            } else {
                // For magnitudes >1, move one month at a time...
                for (var i = 0; i < mag; i++)
                    // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
                    new_date = this.moveMonth(new_date, dir);
                // ...then reset the day, keeping it in the new month
                new_month = new_date.getUTCMonth();
                new_date.setUTCDate(day);
                test = function () {
                    return new_month !== new_date.getUTCMonth();
                };
            }
            // Common date-resetting loop -- if date is beyond end of month, make it
            // end of month
            while (test()) {
                new_date.setUTCDate(--day);
                new_date.setUTCMonth(new_month);
            }
            return new_date;
        },

        moveYear: function (date, dir) {
            return this.moveMonth(date, dir * 12);
        },

        moveAvailableDate: function (date, dir, fn) {
            do {
                date = this[fn](date, dir);

                if (!this.dateWithinRange(date))
                    return false;

                fn = 'moveDay';
            }
            while (this.dateIsDisabled(date));

            return date;
        },

        weekOfDateIsDisabled: function (date) {
            return $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1;
        },

        dateIsDisabled: function (date) {
            return (
                this.weekOfDateIsDisabled(date) ||
                $.grep(this.o.datesDisabled, function (d) {
                    return isUTCEquals(date, d);
                }).length > 0
            );
        },

        dateWithinRange: function (date) {
            return date >= this.o.startDate && date <= this.o.endDate;
        },

        keydown: function (e) {
            if (!this.picker.is(':visible')) {
                if (e.keyCode === 40 || e.keyCode === 27) { // allow down to re-show picker
                    this.show();
                    e.stopPropagation();
                }
                return;
            }
            var dateChanged = false,
                dir, newViewDate,
                focusDate = this.focusDate || this.viewDate;
            switch (e.keyCode) {
                case 27: // escape
                    if (this.focusDate) {
                        this.focusDate = null;
                        this.viewDate = this.dates.get(-1) || this.viewDate;
                        this.fill();
                    } else
                        this.hide();
                    e.preventDefault();
                    e.stopPropagation();
                    break;
                case 37: // left
                case 38: // up
                case 39: // right
                case 40: // down
                    if (!this.o.keyboardNavigation || this.o.daysOfWeekDisabled.length === 7)
                        break;
                    dir = e.keyCode === 37 || e.keyCode === 38 ? -1 : 1;
                    if (this.viewMode === 0) {
                        if (e.ctrlKey) {
                            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');

                            if (newViewDate)
                                this._trigger('changeYear', this.viewDate);
                        } else if (e.shiftKey) {
                            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');

                            if (newViewDate)
                                this._trigger('changeMonth', this.viewDate);
                        } else if (e.keyCode === 37 || e.keyCode === 39) {
                            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveDay');
                        } else if (!this.weekOfDateIsDisabled(focusDate)) {
                            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveWeek');
                        }
                    } else if (this.viewMode === 1) {
                        if (e.keyCode === 38 || e.keyCode === 40) {
                            dir = dir * 4;
                        }
                        newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');
                    } else if (this.viewMode === 2) {
                        if (e.keyCode === 38 || e.keyCode === 40) {
                            dir = dir * 4;
                        }
                        newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');
                    }
                    if (newViewDate) {
                        this.focusDate = this.viewDate = newViewDate;
                        this.setValue();
                        this.fill();
                        e.preventDefault();
                    }
                    break;
                case 13: // enter
                    if (!this.o.forceParse)
                        break;
                    focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
                    if (this.o.keyboardNavigation) {
                        this._toggle_multidate(focusDate);
                        dateChanged = true;
                    }
                    this.focusDate = null;
                    this.viewDate = this.dates.get(-1) || this.viewDate;
                    this.setValue();
                    this.fill();
                    if (this.picker.is(':visible')) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (this.o.autoclose)
                            this.hide();
                    }
                    break;
                case 9: // tab
                    this.focusDate = null;
                    this.viewDate = this.dates.get(-1) || this.viewDate;
                    this.fill();
                    this.hide();
                    break;
            }
            if (dateChanged) {
                if (this.dates.length)
                    this._trigger('changeDate');
                else
                    this._trigger('clearDate');
                if (this.inputField) {
                    this.inputField.change();
                }
            }
        },

        showMode: function (dir) {
            if (dir) {
                this.viewMode = Math.max(this.o.minViewMode, Math.min(this.o.maxViewMode, this.viewMode + dir));
            }
            this.picker
                .children('div')
                .hide()
                .filter('.datepicker-' + DPGlobal.modes[this.viewMode].clsName)
                .show();
            this.updateNavArrows();
        }
    };

    var DateRangePicker = function (element, options) {
        $(element).data('datepicker', this);
        this.element = $(element);
        this.inputs = $.map(options.inputs, function (i) {
            return i.jquery ? i[0] : i;
        });
        delete options.inputs;

        datepickerPlugin.call($(this.inputs), options)
            .on('changeDate', $.proxy(this.dateUpdated, this));

        this.pickers = $.map(this.inputs, function (i) {
            return $(i).data('datepicker');
        });
        this.updateDates();
    };
    DateRangePicker.prototype = {
        updateDates: function () {
            this.dates = $.map(this.pickers, function (i) {
                return i.getUTCDate();
            });
            this.updateRanges();
        },
        updateRanges: function () {
            var range = $.map(this.dates, function (d) {
                return d.valueOf();
            });
            $.each(this.pickers, function (i, p) {
                p.setRange(range);
            });
        },
        dateUpdated: function (e) {
            // `this.updating` is a workaround for preventing infinite recursion
            // between `changeDate` triggering and `setUTCDate` calling.  Until
            // there is a better mechanism.
            if (this.updating)
                return;
            this.updating = true;

            var dp = $(e.target).data('datepicker');

            if (typeof (dp) === "undefined") {
                return;
            }

            var new_date = dp.getUTCDate(),
                i = $.inArray(e.target, this.inputs),
                j = i - 1,
                k = i + 1,
                l = this.inputs.length;
            if (i === -1)
                return;

            $.each(this.pickers, function (i, p) {
                if (!p.getUTCDate())
                    p.setUTCDate(new_date);
            });

            if (new_date < this.dates[j]) {
                // Date being moved earlier/left
                while (j >= 0 && new_date < this.dates[j]) {
                    this.pickers[j--].setUTCDate(new_date);
                }
            } else if (new_date > this.dates[k]) {
                // Date being moved later/right
                while (k < l && new_date > this.dates[k]) {
                    this.pickers[k++].setUTCDate(new_date);
                }
            }
            this.updateDates();

            delete this.updating;
        },
        remove: function () {
            $.map(this.pickers, function (p) {
                p.remove();
            });
            delete this.element.data().datepicker;
        }
    };

    function opts_from_el(el, prefix) {
        // Derive options from element data-attrs
        var data = $(el).data(),
            out = {},
            inkey,
            replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
        prefix = new RegExp('^' + prefix.toLowerCase());

        function re_lower(_, a) {
            return a.toLowerCase();
        }
        for (var key in data)
            if (prefix.test(key)) {
                inkey = key.replace(replace, re_lower);
                out[inkey] = data[key];
            }
        return out;
    }

    function opts_from_locale(lang) {
        // Derive options from locale plugins
        var out = {};
        // Check if "de-DE" style date is available, if not language should
        // fallback to 2 letter code eg "de"
        if (!dates[lang]) {
            lang = lang.split('-')[0];
            if (!dates[lang])
                return;
        }
        var d = dates[lang];
        $.each(locale_opts, function (i, k) {
            if (k in d)
                out[k] = d[k];
        });
        return out;
    }

    var old = $.fn.datepicker;
    var datepickerPlugin = function (option) {
        var args = Array.apply(null, arguments);
        args.shift();
        var internal_return;
        this.each(function () {
            var $this = $(this),
                data = $this.data('datepicker'),
                options = typeof option === 'object' && option;
            if (!data) {
                var elopts = opts_from_el(this, 'date'),
                    // Preliminary otions
                    xopts = $.extend({}, defaults, elopts, options),
                    locopts = opts_from_locale(xopts.language),
                    // Options priority: js args, data-attrs, locales, defaults
                    opts = $.extend({}, defaults, locopts, elopts, options);
                if ($this.hasClass('input-daterange') || opts.inputs) {
                    $.extend(opts, {
                        inputs: opts.inputs || $this.find('input').toArray()
                    });
                    data = new DateRangePicker(this, opts);
                } else {
                    data = new Datepicker(this, opts);
                }
                $this.data('datepicker', data);
            }
            if (typeof option === 'string' && typeof data[option] === 'function') {
                internal_return = data[option].apply(data, args);
            }
        });

        if (
            internal_return === undefined ||
            internal_return instanceof Datepicker ||
            internal_return instanceof DateRangePicker
        )
            return this;

        if (this.length > 1)
            throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
        else
            return internal_return;
    };
    $.fn.datepicker = datepickerPlugin;

    var defaults = $.fn.datepicker.defaults = {
        assumeNearbyYear: false,
        autoclose: false,
        beforeShowDay: $.noop,
        beforeShowMonth: $.noop,
        beforeShowYear: $.noop,
        beforeShowDecade: $.noop,
        beforeShowCentury: $.noop,
        calendarWeeks: false,
        clearBtn: false,
        toggleActive: false,
        daysOfWeekDisabled: [],
        daysOfWeekHighlighted: [],
        datesDisabled: [],
        endDate: Infinity,
        forceParse: true,
        format: 'mm/dd/yyyy',
        keyboardNavigation: true,
        language: 'en',
        minViewMode: 0,
        maxViewMode: 4,
        multidate: false,
        multidateSeparator: ',',
        orientation: "auto",
        rtl: false,
        startDate: -Infinity,
        startView: 0,
        todayBtn: false,
        todayHighlight: false,
        weekStart: 0,
        disableTouchKeyboard: false,
        enableOnReadonly: true,
        showOnFocus: true,
        zIndexOffset: 10,
        container: 'body',
        immediateUpdates: false,
        title: '',
        templates: {
            leftArrow: '&laquo;',
            rightArrow: '&raquo;'
        }
    };
    var locale_opts = $.fn.datepicker.locale_opts = [
		'format',
		'rtl',
		'weekStart'
	];
    $.fn.datepicker.Constructor = Datepicker;
    var dates = $.fn.datepicker.dates = {
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today",
            clear: "Clear",
            titleFormat: "MM yyyy"
        }
    };

    var DPGlobal = {
        modes: [
            {
                clsName: 'days',
                navFnc: 'Month',
                navStep: 1
			},
            {
                clsName: 'months',
                navFnc: 'FullYear',
                navStep: 1
			},
            {
                clsName: 'years',
                navFnc: 'FullYear',
                navStep: 10
			},
            {
                clsName: 'decades',
                navFnc: 'FullDecade',
                navStep: 100
			},
            {
                clsName: 'centuries',
                navFnc: 'FullCentury',
                navStep: 1000
		}],
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
        },
        getDaysInMonth: function (year, month) {
            return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },
        validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
        nonpunctuation: /[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,
        parseFormat: function (format) {
            if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function')
                return format;
            // IE treats \0 as a string end in inputs (truncating the value),
            // so it's a bad format delimiter, anyway
            var separators = format.replace(this.validParts, '\0').split('\0'),
                parts = format.match(this.validParts);
            if (!separators || !separators.length || !parts || parts.length === 0) {
                throw new Error("Invalid date format.");
            }
            return {
                separators: separators,
                parts: parts
            };
        },
        parseDate: function (date, format, language, assumeNearby) {
            if (!date)
                return undefined;
            if (date instanceof Date)
                return date;
            if (typeof format === 'string')
                format = DPGlobal.parseFormat(format);
            if (format.toValue)
                return format.toValue(date, format, language);
            var part_re = /([\-+]\d+)([dmwy])/,
                parts = date.match(/([\-+]\d+)([dmwy])/g),
                fn_map = {
                    d: 'moveDay',
                    m: 'moveMonth',
                    w: 'moveWeek',
                    y: 'moveYear'
                },
                dateAliases = {
                    yesterday: '-1d',
                    today: '+0d',
                    tomorrow: '+1d'
                },
                part, dir, i, fn;
            if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
                date = new Date();
                for (i = 0; i < parts.length; i++) {
                    part = part_re.exec(parts[i]);
                    dir = parseInt(part[1]);
                    fn = fn_map[part[2]];
                    date = Datepicker.prototype[fn](date, dir);
                }
                return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
            }

            if (typeof dateAliases[date] !== 'undefined') {
                date = dateAliases[date];
                parts = date.match(/([\-+]\d+)([dmwy])/g);

                if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
                    date = new Date();
                    for (i = 0; i < parts.length; i++) {
                        part = part_re.exec(parts[i]);
                        dir = parseInt(part[1]);
                        fn = fn_map[part[2]];
                        date = Datepicker.prototype[fn](date, dir);
                    }

                    return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
                }
            }

            parts = date && date.match(this.nonpunctuation) || [];
            date = new Date();

            function applyNearbyYear(year, threshold) {
                if (threshold === true)
                    threshold = 10;

                // if year is 2 digits or less, than the user most likely is trying to get a recent century
                if (year < 100) {
                    year += 2000;
                    // if the new year is more than threshold years in advance, use last century
                    if (year > ((new Date()).getFullYear() + threshold)) {
                        year -= 100;
                    }
                }

                return year;
            }

            var parsed = {},
                setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
                setters_map = {
                    yyyy: function (d, v) {
                        return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
                    },
                    yy: function (d, v) {
                        return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
                    },
                    m: function (d, v) {
                        if (isNaN(d))
                            return d;
                        v -= 1;
                        while (v < 0) v += 12;
                        v %= 12;
                        d.setUTCMonth(v);
                        while (d.getUTCMonth() !== v)
                            d.setUTCDate(d.getUTCDate() - 1);
                        return d;
                    },
                    d: function (d, v) {
                        return d.setUTCDate(v);
                    }
                },
                val, filtered;
            setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
            setters_map['dd'] = setters_map['d'];
            date = UTCToday();
            var fparts = format.parts.slice();
            // Remove noop parts
            if (parts.length !== fparts.length) {
                fparts = $(fparts).filter(function (i, p) {
                    return $.inArray(p, setters_order) !== -1;
                }).toArray();
            }
            // Process remainder
            function match_part() {
                var m = this.slice(0, parts[i].length),
                    p = parts[i].slice(0, m.length);
                return m.toLowerCase() === p.toLowerCase();
            }
            if (parts.length === fparts.length) {
                var cnt;
                for (i = 0, cnt = fparts.length; i < cnt; i++) {
                    val = parseInt(parts[i], 10);
                    part = fparts[i];
                    if (isNaN(val)) {
                        switch (part) {
                            case 'MM':
                                filtered = $(dates[language].months).filter(match_part);
                                val = $.inArray(filtered[0], dates[language].months) + 1;
                                break;
                            case 'M':
                                filtered = $(dates[language].monthsShort).filter(match_part);
                                val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                                break;
                        }
                    }
                    parsed[part] = val;
                }
                var _date, s;
                for (i = 0; i < setters_order.length; i++) {
                    s = setters_order[i];
                    if (s in parsed && !isNaN(parsed[s])) {
                        _date = new Date(date);
                        setters_map[s](_date, parsed[s]);
                        if (!isNaN(_date))
                            date = _date;
                    }
                }
            }
            return date;
        },
        formatDate: function (date, format, language) {
            if (!date)
                return '';
            if (typeof format === 'string')
                format = DPGlobal.parseFormat(format);
            if (format.toDisplay)
                return format.toDisplay(date, format, language);
            var val = {
                d: date.getUTCDate(),
                D: dates[language].daysShort[date.getUTCDay()],
                DD: dates[language].days[date.getUTCDay()],
                m: date.getUTCMonth() + 1,
                M: dates[language].monthsShort[date.getUTCMonth()],
                MM: dates[language].months[date.getUTCMonth()],
                yy: date.getUTCFullYear().toString().substring(2),
                yyyy: date.getUTCFullYear()
            };
            val.dd = (val.d < 10 ? '0' : '') + val.d;
            val.mm = (val.m < 10 ? '0' : '') + val.m;
            date = [];
            var seps = $.extend([], format.separators);
            for (var i = 0, cnt = format.parts.length; i <= cnt; i++) {
                if (seps.length)
                    date.push(seps.shift());
                date.push(val[format.parts[i]]);
            }
            return date.join('');
        },
        headTemplate: '<thead>' +
            '<tr>' +
            '<th colspan="7" class="datepicker-title"></th>' +
            '</tr>' +
            '<tr>' +
            '<th class="prev">&laquo;</th>' +
            '<th colspan="5" class="datepicker-switch"></th>' +
            '<th class="next">&raquo;</th>' +
            '</tr>' +
            '</thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
        footTemplate: '<tfoot>' +
            '<tr>' +
            '<th colspan="7" class="today"></th>' +
            '</tr>' +
            '<tr>' +
            '<th colspan="7" class="clear"></th>' +
            '</tr>' +
            '</tfoot>'
    };
    DPGlobal.template = '<div class="datepicker">' +
        '<div class="datepicker-days">' +
        '<table class="table-condensed">' +
        DPGlobal.headTemplate +
        '<tbody></tbody>' +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '<div class="datepicker-months">' +
        '<table class="table-condensed">' +
        DPGlobal.headTemplate +
        DPGlobal.contTemplate +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '<div class="datepicker-years">' +
        '<table class="table-condensed">' +
        DPGlobal.headTemplate +
        DPGlobal.contTemplate +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '<div class="datepicker-decades">' +
        '<table class="table-condensed">' +
        DPGlobal.headTemplate +
        DPGlobal.contTemplate +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '<div class="datepicker-centuries">' +
        '<table class="table-condensed">' +
        DPGlobal.headTemplate +
        DPGlobal.contTemplate +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '</div>';

    $.fn.datepicker.DPGlobal = DPGlobal;


    /* DATEPICKER NO CONFLICT
     * =================== */

    $.fn.datepicker.noConflict = function () {
        $.fn.datepicker = old;
        return this;
    };

    /* DATEPICKER VERSION
     * =================== */
    $.fn.datepicker.version = '1.6.4';

    /* DATEPICKER DATA-API
     * ================== */

    $(document).on(
        'focus.datepicker.data-api click.datepicker.data-api',
        '[data-provide="datepicker"]',
        function (e) {
            var $this = $(this);
            if ($this.data('datepicker'))
                return;
            e.preventDefault();
            // component click requires us to explicitly show it
            datepickerPlugin.call($this, 'show');
        }
    );
    $(function () {
        datepickerPlugin.call($('[data-provide="datepicker-inline"]'));
    });

}));
//! moment.js
//! version : 2.12.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
! function (a, b) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define(b) : a.moment = b()
}(this, function () {
    "use strict";

    function a() {
        return Zc.apply(null, arguments)
    }

    function b(a) {
        Zc = a
    }

    function c(a) {
        return a instanceof Array || "[object Array]" === Object.prototype.toString.call(a)
    }

    function d(a) {
        return a instanceof Date || "[object Date]" === Object.prototype.toString.call(a)
    }

    function e(a, b) {
        var c, d = [];
        for (c = 0; c < a.length; ++c) d.push(b(a[c], c));
        return d
    }

    function f(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    }

    function g(a, b) {
        for (var c in b) f(b, c) && (a[c] = b[c]);
        return f(b, "toString") && (a.toString = b.toString), f(b, "valueOf") && (a.valueOf = b.valueOf), a
    }

    function h(a, b, c, d) {
        return Ia(a, b, c, d, !0).utc()
    }

    function i() {
        return {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1
        }
    }

    function j(a) {
        return null == a._pf && (a._pf = i()), a._pf
    }

    function k(a) {
        if (null == a._isValid) {
            var b = j(a);
            a._isValid = !(isNaN(a._d.getTime()) || !(b.overflow < 0) || b.empty || b.invalidMonth || b.invalidWeekday || b.nullInput || b.invalidFormat || b.userInvalidated), a._strict && (a._isValid = a._isValid && 0 === b.charsLeftOver && 0 === b.unusedTokens.length && void 0 === b.bigHour)
        }
        return a._isValid
    }

    function l(a) {
        var b = h(NaN);
        return null != a ? g(j(b), a) : j(b).userInvalidated = !0, b
    }

    function m(a) {
        return void 0 === a
    }

    function n(a, b) {
        var c, d, e;
        if (m(b._isAMomentObject) || (a._isAMomentObject = b._isAMomentObject), m(b._i) || (a._i = b._i), m(b._f) || (a._f = b._f), m(b._l) || (a._l = b._l), m(b._strict) || (a._strict = b._strict), m(b._tzm) || (a._tzm = b._tzm), m(b._isUTC) || (a._isUTC = b._isUTC), m(b._offset) || (a._offset = b._offset), m(b._pf) || (a._pf = j(b)), m(b._locale) || (a._locale = b._locale), $c.length > 0)
            for (c in $c) d = $c[c], e = b[d], m(e) || (a[d] = e);
        return a
    }

    function o(b) {
        n(this, b), this._d = new Date(null != b._d ? b._d.getTime() : NaN), _c === !1 && (_c = !0, a.updateOffset(this), _c = !1)
    }

    function p(a) {
        return a instanceof o || null != a && null != a._isAMomentObject
    }

    function q(a) {
        return 0 > a ? Math.ceil(a) : Math.floor(a)
    }

    function r(a) {
        var b = +a,
            c = 0;
        return 0 !== b && isFinite(b) && (c = q(b)), c
    }

    function s(a, b, c) {
        var d, e = Math.min(a.length, b.length),
            f = Math.abs(a.length - b.length),
            g = 0;
        for (d = 0; e > d; d++)(c && a[d] !== b[d] || !c && r(a[d]) !== r(b[d])) && g++;
        return g + f
    }

    function t(b) {
        a.suppressDeprecationWarnings === !1 && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + b)
    }

    function u(a, b) {
        var c = !0;
        return g(function () {
            return c && (t(a + "\nArguments: " + Array.prototype.slice.call(arguments).join(", ") + "\n" + (new Error).stack), c = !1), b.apply(this, arguments)
        }, b)
    }

    function v(a, b) {
        ad[a] || (t(b), ad[a] = !0)
    }

    function w(a) {
        return a instanceof Function || "[object Function]" === Object.prototype.toString.call(a)
    }

    function x(a) {
        return "[object Object]" === Object.prototype.toString.call(a)
    }

    function y(a) {
        var b, c;
        for (c in a) b = a[c], w(b) ? this[c] = b : this["_" + c] = b;
        this._config = a, this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source)
    }

    function z(a, b) {
        var c, d = g({}, a);
        for (c in b) f(b, c) && (x(a[c]) && x(b[c]) ? (d[c] = {}, g(d[c], a[c]), g(d[c], b[c])) : null != b[c] ? d[c] = b[c] : delete d[c]);
        return d
    }

    function A(a) {
        null != a && this.set(a)
    }

    function B(a) {
        return a ? a.toLowerCase().replace("_", "-") : a
    }

    function C(a) {
        for (var b, c, d, e, f = 0; f < a.length;) {
            for (e = B(a[f]).split("-"), b = e.length, c = B(a[f + 1]), c = c ? c.split("-") : null; b > 0;) {
                if (d = D(e.slice(0, b).join("-"))) return d;
                if (c && c.length >= b && s(e, c, !0) >= b - 1) break;
                b--
            }
            f++
        }
        return null
    }

    function D(a) {
        var b = null;
        if (!cd[a] && "undefined" != typeof module && module && module.exports) try {
            b = bd._abbr, require("./locale/" + a), E(b)
        } catch (c) {}
        return cd[a]
    }

    function E(a, b) {
        var c;
        return a && (c = m(b) ? H(a) : F(a, b), c && (bd = c)), bd._abbr
    }

    function F(a, b) {
        return null !== b ? (b.abbr = a, null != cd[a] ? (v("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale"), b = z(cd[a]._config, b)) : null != b.parentLocale && (null != cd[b.parentLocale] ? b = z(cd[b.parentLocale]._config, b) : v("parentLocaleUndefined", "specified parentLocale is not defined yet")), cd[a] = new A(b), E(a), cd[a]) : (delete cd[a], null)
    }

    function G(a, b) {
        if (null != b) {
            var c;
            null != cd[a] && (b = z(cd[a]._config, b)), c = new A(b), c.parentLocale = cd[a], cd[a] = c, E(a)
        } else null != cd[a] && (null != cd[a].parentLocale ? cd[a] = cd[a].parentLocale : null != cd[a] && delete cd[a]);
        return cd[a]
    }

    function H(a) {
        var b;
        if (a && a._locale && a._locale._abbr && (a = a._locale._abbr), !a) return bd;
        if (!c(a)) {
            if (b = D(a)) return b;
            a = [a]
        }
        return C(a)
    }

    function I() {
        return Object.keys(cd)
    }

    function J(a, b) {
        var c = a.toLowerCase();
        dd[c] = dd[c + "s"] = dd[b] = a
    }

    function K(a) {
        return "string" == typeof a ? dd[a] || dd[a.toLowerCase()] : void 0
    }

    function L(a) {
        var b, c, d = {};
        for (c in a) f(a, c) && (b = K(c), b && (d[b] = a[c]));
        return d
    }

    function M(b, c) {
        return function (d) {
            return null != d ? (O(this, b, d), a.updateOffset(this, c), this) : N(this, b)
        }
    }

    function N(a, b) {
        return a.isValid() ? a._d["get" + (a._isUTC ? "UTC" : "") + b]() : NaN
    }

    function O(a, b, c) {
        a.isValid() && a._d["set" + (a._isUTC ? "UTC" : "") + b](c)
    }

    function P(a, b) {
        var c;
        if ("object" == typeof a)
            for (c in a) this.set(c, a[c]);
        else if (a = K(a), w(this[a])) return this[a](b);
        return this
    }

    function Q(a, b, c) {
        var d = "" + Math.abs(a),
            e = b - d.length,
            f = a >= 0;
        return (f ? c ? "+" : "" : "-") + Math.pow(10, Math.max(0, e)).toString().substr(1) + d
    }

    function R(a, b, c, d) {
        var e = d;
        "string" == typeof d && (e = function () {
            return this[d]()
        }), a && (hd[a] = e), b && (hd[b[0]] = function () {
            return Q(e.apply(this, arguments), b[1], b[2])
        }), c && (hd[c] = function () {
            return this.localeData().ordinal(e.apply(this, arguments), a)
        })
    }

    function S(a) {
        return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "")
    }

    function T(a) {
        var b, c, d = a.match(ed);
        for (b = 0, c = d.length; c > b; b++) hd[d[b]] ? d[b] = hd[d[b]] : d[b] = S(d[b]);
        return function (e) {
            var f = "";
            for (b = 0; c > b; b++) f += d[b] instanceof Function ? d[b].call(e, a) : d[b];
            return f
        }
    }

    function U(a, b) {
        return a.isValid() ? (b = V(b, a.localeData()), gd[b] = gd[b] || T(b), gd[b](a)) : a.localeData().invalidDate()
    }

    function V(a, b) {
        function c(a) {
            return b.longDateFormat(a) || a
        }
        var d = 5;
        for (fd.lastIndex = 0; d >= 0 && fd.test(a);) a = a.replace(fd, c), fd.lastIndex = 0, d -= 1;
        return a
    }

    function W(a, b, c) {
        zd[a] = w(b) ? b : function (a, d) {
            return a && c ? c : b
        }
    }

    function X(a, b) {
        return f(zd, a) ? zd[a](b._strict, b._locale) : new RegExp(Y(a))
    }

    function Y(a) {
        return Z(a.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (a, b, c, d, e) {
            return b || c || d || e
        }))
    }

    function Z(a) {
        return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }

    function $(a, b) {
        var c, d = b;
        for ("string" == typeof a && (a = [a]), "number" == typeof b && (d = function (a, c) {
                c[b] = r(a)
            }), c = 0; c < a.length; c++) Ad[a[c]] = d
    }

    function _(a, b) {
        $(a, function (a, c, d, e) {
            d._w = d._w || {}, b(a, d._w, d, e)
        })
    }

    function aa(a, b, c) {
        null != b && f(Ad, a) && Ad[a](b, c._a, c, a)
    }

    function ba(a, b) {
        return new Date(Date.UTC(a, b + 1, 0)).getUTCDate()
    }

    function ca(a, b) {
        return c(this._months) ? this._months[a.month()] : this._months[Kd.test(b) ? "format" : "standalone"][a.month()]
    }

    function da(a, b) {
        return c(this._monthsShort) ? this._monthsShort[a.month()] : this._monthsShort[Kd.test(b) ? "format" : "standalone"][a.month()]
    }

    function ea(a, b, c) {
        var d, e, f;
        for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), d = 0; 12 > d; d++) {
            if (e = h([2e3, d]), c && !this._longMonthsParse[d] && (this._longMonthsParse[d] = new RegExp("^" + this.months(e, "").replace(".", "") + "$", "i"), this._shortMonthsParse[d] = new RegExp("^" + this.monthsShort(e, "").replace(".", "") + "$", "i")), c || this._monthsParse[d] || (f = "^" + this.months(e, "") + "|^" + this.monthsShort(e, ""), this._monthsParse[d] = new RegExp(f.replace(".", ""), "i")), c && "MMMM" === b && this._longMonthsParse[d].test(a)) return d;
            if (c && "MMM" === b && this._shortMonthsParse[d].test(a)) return d;
            if (!c && this._monthsParse[d].test(a)) return d
        }
    }

    function fa(a, b) {
        var c;
        if (!a.isValid()) return a;
        if ("string" == typeof b)
            if (/^\d+$/.test(b)) b = r(b);
            else if (b = a.localeData().monthsParse(b), "number" != typeof b) return a;
        return c = Math.min(a.date(), ba(a.year(), b)), a._d["set" + (a._isUTC ? "UTC" : "") + "Month"](b, c), a
    }

    function ga(b) {
        return null != b ? (fa(this, b), a.updateOffset(this, !0), this) : N(this, "Month")
    }

    function ha() {
        return ba(this.year(), this.month())
    }

    function ia(a) {
        return this._monthsParseExact ? (f(this, "_monthsRegex") || ka.call(this), a ? this._monthsShortStrictRegex : this._monthsShortRegex) : this._monthsShortStrictRegex && a ? this._monthsShortStrictRegex : this._monthsShortRegex
    }

    function ja(a) {
        return this._monthsParseExact ? (f(this, "_monthsRegex") || ka.call(this), a ? this._monthsStrictRegex : this._monthsRegex) : this._monthsStrictRegex && a ? this._monthsStrictRegex : this._monthsRegex
    }

    function ka() {
        function a(a, b) {
            return b.length - a.length
        }
        var b, c, d = [],
            e = [],
            f = [];
        for (b = 0; 12 > b; b++) c = h([2e3, b]), d.push(this.monthsShort(c, "")), e.push(this.months(c, "")), f.push(this.months(c, "")), f.push(this.monthsShort(c, ""));
        for (d.sort(a), e.sort(a), f.sort(a), b = 0; 12 > b; b++) d[b] = Z(d[b]), e[b] = Z(e[b]), f[b] = Z(f[b]);
        this._monthsRegex = new RegExp("^(" + f.join("|") + ")", "i"), this._monthsShortRegex = this._monthsRegex, this._monthsStrictRegex = new RegExp("^(" + e.join("|") + ")$", "i"), this._monthsShortStrictRegex = new RegExp("^(" + d.join("|") + ")$", "i")
    }

    function la(a) {
        var b, c = a._a;
        return c && -2 === j(a).overflow && (b = c[Cd] < 0 || c[Cd] > 11 ? Cd : c[Dd] < 1 || c[Dd] > ba(c[Bd], c[Cd]) ? Dd : c[Ed] < 0 || c[Ed] > 24 || 24 === c[Ed] && (0 !== c[Fd] || 0 !== c[Gd] || 0 !== c[Hd]) ? Ed : c[Fd] < 0 || c[Fd] > 59 ? Fd : c[Gd] < 0 || c[Gd] > 59 ? Gd : c[Hd] < 0 || c[Hd] > 999 ? Hd : -1, j(a)._overflowDayOfYear && (Bd > b || b > Dd) && (b = Dd), j(a)._overflowWeeks && -1 === b && (b = Id), j(a)._overflowWeekday && -1 === b && (b = Jd), j(a).overflow = b), a
    }

    function ma(a) {
        var b, c, d, e, f, g, h = a._i,
            i = Pd.exec(h) || Qd.exec(h);
        if (i) {
            for (j(a).iso = !0, b = 0, c = Sd.length; c > b; b++)
                if (Sd[b][1].exec(i[1])) {
                    e = Sd[b][0], d = Sd[b][2] !== !1;
                    break
                } if (null == e) return void(a._isValid = !1);
            if (i[3]) {
                for (b = 0, c = Td.length; c > b; b++)
                    if (Td[b][1].exec(i[3])) {
                        f = (i[2] || " ") + Td[b][0];
                        break
                    } if (null == f) return void(a._isValid = !1)
            }
            if (!d && null != f) return void(a._isValid = !1);
            if (i[4]) {
                if (!Rd.exec(i[4])) return void(a._isValid = !1);
                g = "Z"
            }
            a._f = e + (f || "") + (g || ""), Ba(a)
        } else a._isValid = !1
    }

    function na(b) {
        var c = Ud.exec(b._i);
        return null !== c ? void(b._d = new Date(+c[1])) : (ma(b), void(b._isValid === !1 && (delete b._isValid, a.createFromInputFallback(b))))
    }

    function oa(a, b, c, d, e, f, g) {
        var h = new Date(a, b, c, d, e, f, g);
        return 100 > a && a >= 0 && isFinite(h.getFullYear()) && h.setFullYear(a), h
    }

    function pa(a) {
        var b = new Date(Date.UTC.apply(null, arguments));
        return 100 > a && a >= 0 && isFinite(b.getUTCFullYear()) && b.setUTCFullYear(a), b
    }

    function qa(a) {
        return ra(a) ? 366 : 365
    }

    function ra(a) {
        return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
    }

    function sa() {
        return ra(this.year())
    }

    function ta(a, b, c) {
        var d = 7 + b - c,
            e = (7 + pa(a, 0, d).getUTCDay() - b) % 7;
        return -e + d - 1
    }

    function ua(a, b, c, d, e) {
        var f, g, h = (7 + c - d) % 7,
            i = ta(a, d, e),
            j = 1 + 7 * (b - 1) + h + i;
        return 0 >= j ? (f = a - 1, g = qa(f) + j) : j > qa(a) ? (f = a + 1, g = j - qa(a)) : (f = a, g = j), {
            year: f,
            dayOfYear: g
        }
    }

    function va(a, b, c) {
        var d, e, f = ta(a.year(), b, c),
            g = Math.floor((a.dayOfYear() - f - 1) / 7) + 1;
        return 1 > g ? (e = a.year() - 1, d = g + wa(e, b, c)) : g > wa(a.year(), b, c) ? (d = g - wa(a.year(), b, c), e = a.year() + 1) : (e = a.year(), d = g), {
            week: d,
            year: e
        }
    }

    function wa(a, b, c) {
        var d = ta(a, b, c),
            e = ta(a + 1, b, c);
        return (qa(a) - d + e) / 7
    }

    function xa(a, b, c) {
        return null != a ? a : null != b ? b : c
    }

    function ya(b) {
        var c = new Date(a.now());
        return b._useUTC ? [c.getUTCFullYear(), c.getUTCMonth(), c.getUTCDate()] : [c.getFullYear(), c.getMonth(), c.getDate()]
    }

    function za(a) {
        var b, c, d, e, f = [];
        if (!a._d) {
            for (d = ya(a), a._w && null == a._a[Dd] && null == a._a[Cd] && Aa(a), a._dayOfYear && (e = xa(a._a[Bd], d[Bd]), a._dayOfYear > qa(e) && (j(a)._overflowDayOfYear = !0), c = pa(e, 0, a._dayOfYear), a._a[Cd] = c.getUTCMonth(), a._a[Dd] = c.getUTCDate()), b = 0; 3 > b && null == a._a[b]; ++b) a._a[b] = f[b] = d[b];
            for (; 7 > b; b++) a._a[b] = f[b] = null == a._a[b] ? 2 === b ? 1 : 0 : a._a[b];
            24 === a._a[Ed] && 0 === a._a[Fd] && 0 === a._a[Gd] && 0 === a._a[Hd] && (a._nextDay = !0, a._a[Ed] = 0), a._d = (a._useUTC ? pa : oa).apply(null, f), null != a._tzm && a._d.setUTCMinutes(a._d.getUTCMinutes() - a._tzm), a._nextDay && (a._a[Ed] = 24)
        }
    }

    function Aa(a) {
        var b, c, d, e, f, g, h, i;
        b = a._w, null != b.GG || null != b.W || null != b.E ? (f = 1, g = 4, c = xa(b.GG, a._a[Bd], va(Ja(), 1, 4).year), d = xa(b.W, 1), e = xa(b.E, 1), (1 > e || e > 7) && (i = !0)) : (f = a._locale._week.dow, g = a._locale._week.doy, c = xa(b.gg, a._a[Bd], va(Ja(), f, g).year), d = xa(b.w, 1), null != b.d ? (e = b.d, (0 > e || e > 6) && (i = !0)) : null != b.e ? (e = b.e + f, (b.e < 0 || b.e > 6) && (i = !0)) : e = f), 1 > d || d > wa(c, f, g) ? j(a)._overflowWeeks = !0 : null != i ? j(a)._overflowWeekday = !0 : (h = ua(c, d, e, f, g), a._a[Bd] = h.year, a._dayOfYear = h.dayOfYear)
    }

    function Ba(b) {
        if (b._f === a.ISO_8601) return void ma(b);
        b._a = [], j(b).empty = !0;
        var c, d, e, f, g, h = "" + b._i,
            i = h.length,
            k = 0;
        for (e = V(b._f, b._locale).match(ed) || [], c = 0; c < e.length; c++) f = e[c], d = (h.match(X(f, b)) || [])[0], d && (g = h.substr(0, h.indexOf(d)), g.length > 0 && j(b).unusedInput.push(g), h = h.slice(h.indexOf(d) + d.length), k += d.length), hd[f] ? (d ? j(b).empty = !1 : j(b).unusedTokens.push(f), aa(f, d, b)) : b._strict && !d && j(b).unusedTokens.push(f);
        j(b).charsLeftOver = i - k, h.length > 0 && j(b).unusedInput.push(h), j(b).bigHour === !0 && b._a[Ed] <= 12 && b._a[Ed] > 0 && (j(b).bigHour = void 0), b._a[Ed] = Ca(b._locale, b._a[Ed], b._meridiem), za(b), la(b)
    }

    function Ca(a, b, c) {
        var d;
        return null == c ? b : null != a.meridiemHour ? a.meridiemHour(b, c) : null != a.isPM ? (d = a.isPM(c), d && 12 > b && (b += 12), d || 12 !== b || (b = 0), b) : b
    }

    function Da(a) {
        var b, c, d, e, f;
        if (0 === a._f.length) return j(a).invalidFormat = !0, void(a._d = new Date(NaN));
        for (e = 0; e < a._f.length; e++) f = 0, b = n({}, a), null != a._useUTC && (b._useUTC = a._useUTC), b._f = a._f[e], Ba(b), k(b) && (f += j(b).charsLeftOver, f += 10 * j(b).unusedTokens.length, j(b).score = f, (null == d || d > f) && (d = f, c = b));
        g(a, c || b)
    }

    function Ea(a) {
        if (!a._d) {
            var b = L(a._i);
            a._a = e([b.year, b.month, b.day || b.date, b.hour, b.minute, b.second, b.millisecond], function (a) {
                return a && parseInt(a, 10)
            }), za(a)
        }
    }

    function Fa(a) {
        var b = new o(la(Ga(a)));
        return b._nextDay && (b.add(1, "d"), b._nextDay = void 0), b
    }

    function Ga(a) {
        var b = a._i,
            e = a._f;
        return a._locale = a._locale || H(a._l), null === b || void 0 === e && "" === b ? l({
            nullInput: !0
        }) : ("string" == typeof b && (a._i = b = a._locale.preparse(b)), p(b) ? new o(la(b)) : (c(e) ? Da(a) : e ? Ba(a) : d(b) ? a._d = b : Ha(a), k(a) || (a._d = null), a))
    }

    function Ha(b) {
        var f = b._i;
        void 0 === f ? b._d = new Date(a.now()) : d(f) ? b._d = new Date(+f) : "string" == typeof f ? na(b) : c(f) ? (b._a = e(f.slice(0), function (a) {
            return parseInt(a, 10)
        }), za(b)) : "object" == typeof f ? Ea(b) : "number" == typeof f ? b._d = new Date(f) : a.createFromInputFallback(b)
    }

    function Ia(a, b, c, d, e) {
        var f = {};
        return "boolean" == typeof c && (d = c, c = void 0), f._isAMomentObject = !0, f._useUTC = f._isUTC = e, f._l = c, f._i = a, f._f = b, f._strict = d, Fa(f)
    }

    function Ja(a, b, c, d) {
        return Ia(a, b, c, d, !1)
    }

    function Ka(a, b) {
        var d, e;
        if (1 === b.length && c(b[0]) && (b = b[0]), !b.length) return Ja();
        for (d = b[0], e = 1; e < b.length; ++e)(!b[e].isValid() || b[e][a](d)) && (d = b[e]);
        return d
    }

    function La() {
        var a = [].slice.call(arguments, 0);
        return Ka("isBefore", a)
    }

    function Ma() {
        var a = [].slice.call(arguments, 0);
        return Ka("isAfter", a)
    }

    function Na(a) {
        var b = L(a),
            c = b.year || 0,
            d = b.quarter || 0,
            e = b.month || 0,
            f = b.week || 0,
            g = b.day || 0,
            h = b.hour || 0,
            i = b.minute || 0,
            j = b.second || 0,
            k = b.millisecond || 0;
        this._milliseconds = +k + 1e3 * j + 6e4 * i + 36e5 * h, this._days = +g + 7 * f, this._months = +e + 3 * d + 12 * c, this._data = {}, this._locale = H(), this._bubble()
    }

    function Oa(a) {
        return a instanceof Na
    }

    function Pa(a, b) {
        R(a, 0, 0, function () {
            var a = this.utcOffset(),
                c = "+";
            return 0 > a && (a = -a, c = "-"), c + Q(~~(a / 60), 2) + b + Q(~~a % 60, 2)
        })
    }

    function Qa(a, b) {
        var c = (b || "").match(a) || [],
            d = c[c.length - 1] || [],
            e = (d + "").match(Zd) || ["-", 0, 0],
            f = +(60 * e[1]) + r(e[2]);
        return "+" === e[0] ? f : -f
    }

    function Ra(b, c) {
        var e, f;
        return c._isUTC ? (e = c.clone(), f = (p(b) || d(b) ? +b : +Ja(b)) - +e, e._d.setTime(+e._d + f), a.updateOffset(e, !1), e) : Ja(b).local()
    }

    function Sa(a) {
        return 15 * -Math.round(a._d.getTimezoneOffset() / 15)
    }

    function Ta(b, c) {
        var d, e = this._offset || 0;
        return this.isValid() ? null != b ? ("string" == typeof b ? b = Qa(wd, b) : Math.abs(b) < 16 && (b = 60 * b), !this._isUTC && c && (d = Sa(this)), this._offset = b, this._isUTC = !0, null != d && this.add(d, "m"), e !== b && (!c || this._changeInProgress ? ib(this, cb(b - e, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, a.updateOffset(this, !0), this._changeInProgress = null)), this) : this._isUTC ? e : Sa(this) : null != b ? this : NaN
    }

    function Ua(a, b) {
        return null != a ? ("string" != typeof a && (a = -a), this.utcOffset(a, b), this) : -this.utcOffset()
    }

    function Va(a) {
        return this.utcOffset(0, a)
    }

    function Wa(a) {
        return this._isUTC && (this.utcOffset(0, a), this._isUTC = !1, a && this.subtract(Sa(this), "m")), this
    }

    function Xa() {
        return this._tzm ? this.utcOffset(this._tzm) : "string" == typeof this._i && this.utcOffset(Qa(vd, this._i)), this
    }

    function Ya(a) {
        return this.isValid() ? (a = a ? Ja(a).utcOffset() : 0, (this.utcOffset() - a) % 60 === 0) : !1
    }

    function Za() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset()
    }

    function $a() {
        if (!m(this._isDSTShifted)) return this._isDSTShifted;
        var a = {};
        if (n(a, this), a = Ga(a), a._a) {
            var b = a._isUTC ? h(a._a) : Ja(a._a);
            this._isDSTShifted = this.isValid() && s(a._a, b.toArray()) > 0
        } else this._isDSTShifted = !1;
        return this._isDSTShifted
    }

    function _a() {
        return this.isValid() ? !this._isUTC : !1
    }

    function ab() {
        return this.isValid() ? this._isUTC : !1
    }

    function bb() {
        return this.isValid() ? this._isUTC && 0 === this._offset : !1
    }

    function cb(a, b) {
        var c, d, e, g = a,
            h = null;
        return Oa(a) ? g = {
            ms: a._milliseconds,
            d: a._days,
            M: a._months
        } : "number" == typeof a ? (g = {}, b ? g[b] = a : g.milliseconds = a) : (h = $d.exec(a)) ? (c = "-" === h[1] ? -1 : 1, g = {
            y: 0,
            d: r(h[Dd]) * c,
            h: r(h[Ed]) * c,
            m: r(h[Fd]) * c,
            s: r(h[Gd]) * c,
            ms: r(h[Hd]) * c
        }) : (h = _d.exec(a)) ? (c = "-" === h[1] ? -1 : 1, g = {
            y: db(h[2], c),
            M: db(h[3], c),
            w: db(h[4], c),
            d: db(h[5], c),
            h: db(h[6], c),
            m: db(h[7], c),
            s: db(h[8], c)
        }) : null == g ? g = {} : "object" == typeof g && ("from" in g || "to" in g) && (e = fb(Ja(g.from), Ja(g.to)), g = {}, g.ms = e.milliseconds, g.M = e.months), d = new Na(g), Oa(a) && f(a, "_locale") && (d._locale = a._locale), d
    }

    function db(a, b) {
        var c = a && parseFloat(a.replace(",", "."));
        return (isNaN(c) ? 0 : c) * b
    }

    function eb(a, b) {
        var c = {
            milliseconds: 0,
            months: 0
        };
        return c.months = b.month() - a.month() + 12 * (b.year() - a.year()), a.clone().add(c.months, "M").isAfter(b) && --c.months, c.milliseconds = +b - +a.clone().add(c.months, "M"), c
    }

    function fb(a, b) {
        var c;
        return a.isValid() && b.isValid() ? (b = Ra(b, a), a.isBefore(b) ? c = eb(a, b) : (c = eb(b, a), c.milliseconds = -c.milliseconds, c.months = -c.months), c) : {
            milliseconds: 0,
            months: 0
        }
    }

    function gb(a) {
        return 0 > a ? -1 * Math.round(-1 * a) : Math.round(a)
    }

    function hb(a, b) {
        return function (c, d) {
            var e, f;
            return null === d || isNaN(+d) || (v(b, "moment()." + b + "(period, number) is deprecated. Please use moment()." + b + "(number, period)."), f = c, c = d, d = f), c = "string" == typeof c ? +c : c, e = cb(c, d), ib(this, e, a), this
        }
    }

    function ib(b, c, d, e) {
        var f = c._milliseconds,
            g = gb(c._days),
            h = gb(c._months);
        b.isValid() && (e = null == e ? !0 : e, f && b._d.setTime(+b._d + f * d), g && O(b, "Date", N(b, "Date") + g * d), h && fa(b, N(b, "Month") + h * d), e && a.updateOffset(b, g || h))
    }

    function jb(a, b) {
        var c = a || Ja(),
            d = Ra(c, this).startOf("day"),
            e = this.diff(d, "days", !0),
            f = -6 > e ? "sameElse" : -1 > e ? "lastWeek" : 0 > e ? "lastDay" : 1 > e ? "sameDay" : 2 > e ? "nextDay" : 7 > e ? "nextWeek" : "sameElse",
            g = b && (w(b[f]) ? b[f]() : b[f]);
        return this.format(g || this.localeData().calendar(f, this, Ja(c)))
    }

    function kb() {
        return new o(this)
    }

    function lb(a, b) {
        var c = p(a) ? a : Ja(a);
        return this.isValid() && c.isValid() ? (b = K(m(b) ? "millisecond" : b), "millisecond" === b ? +this > +c : +c < +this.clone().startOf(b)) : !1
    }

    function mb(a, b) {
        var c = p(a) ? a : Ja(a);
        return this.isValid() && c.isValid() ? (b = K(m(b) ? "millisecond" : b), "millisecond" === b ? +c > +this : +this.clone().endOf(b) < +c) : !1
    }

    function nb(a, b, c) {
        return this.isAfter(a, c) && this.isBefore(b, c)
    }

    function ob(a, b) {
        var c, d = p(a) ? a : Ja(a);
        return this.isValid() && d.isValid() ? (b = K(b || "millisecond"), "millisecond" === b ? +this === +d : (c = +d, +this.clone().startOf(b) <= c && c <= +this.clone().endOf(b))) : !1
    }

    function pb(a, b) {
        return this.isSame(a, b) || this.isAfter(a, b)
    }

    function qb(a, b) {
        return this.isSame(a, b) || this.isBefore(a, b)
    }

    function rb(a, b, c) {
        var d, e, f, g;
        return this.isValid() ? (d = Ra(a, this), d.isValid() ? (e = 6e4 * (d.utcOffset() - this.utcOffset()), b = K(b), "year" === b || "month" === b || "quarter" === b ? (g = sb(this, d), "quarter" === b ? g /= 3 : "year" === b && (g /= 12)) : (f = this - d, g = "second" === b ? f / 1e3 : "minute" === b ? f / 6e4 : "hour" === b ? f / 36e5 : "day" === b ? (f - e) / 864e5 : "week" === b ? (f - e) / 6048e5 : f), c ? g : q(g)) : NaN) : NaN
    }

    function sb(a, b) {
        var c, d, e = 12 * (b.year() - a.year()) + (b.month() - a.month()),
            f = a.clone().add(e, "months");
        return 0 > b - f ? (c = a.clone().add(e - 1, "months"), d = (b - f) / (f - c)) : (c = a.clone().add(e + 1, "months"), d = (b - f) / (c - f)), -(e + d)
    }

    function tb() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
    }

    function ub() {
        var a = this.clone().utc();
        return 0 < a.year() && a.year() <= 9999 ? w(Date.prototype.toISOString) ? this.toDate().toISOString() : U(a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : U(a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
    }

    function vb(b) {
        var c = U(this, b || a.defaultFormat);
        return this.localeData().postformat(c)
    }

    function wb(a, b) {
        return this.isValid() && (p(a) && a.isValid() || Ja(a).isValid()) ? cb({
            to: this,
            from: a
        }).locale(this.locale()).humanize(!b) : this.localeData().invalidDate()
    }

    function xb(a) {
        return this.from(Ja(), a)
    }

    function yb(a, b) {
        return this.isValid() && (p(a) && a.isValid() || Ja(a).isValid()) ? cb({
            from: this,
            to: a
        }).locale(this.locale()).humanize(!b) : this.localeData().invalidDate()
    }

    function zb(a) {
        return this.to(Ja(), a)
    }

    function Ab(a) {
        var b;
        return void 0 === a ? this._locale._abbr : (b = H(a), null != b && (this._locale = b), this)
    }

    function Bb() {
        return this._locale
    }

    function Cb(a) {
        switch (a = K(a)) {
            case "year":
                this.month(0);
            case "quarter":
            case "month":
                this.date(1);
            case "week":
            case "isoWeek":
            case "day":
                this.hours(0);
            case "hour":
                this.minutes(0);
            case "minute":
                this.seconds(0);
            case "second":
                this.milliseconds(0)
        }
        return "week" === a && this.weekday(0), "isoWeek" === a && this.isoWeekday(1), "quarter" === a && this.month(3 * Math.floor(this.month() / 3)), this
    }

    function Db(a) {
        return a = K(a), void 0 === a || "millisecond" === a ? this : this.startOf(a).add(1, "isoWeek" === a ? "week" : a).subtract(1, "ms")
    }

    function Eb() {
        return +this._d - 6e4 * (this._offset || 0)
    }

    function Fb() {
        return Math.floor(+this / 1e3)
    }

    function Gb() {
        return this._offset ? new Date(+this) : this._d
    }

    function Hb() {
        var a = this;
        return [a.year(), a.month(), a.date(), a.hour(), a.minute(), a.second(), a.millisecond()]
    }

    function Ib() {
        var a = this;
        return {
            years: a.year(),
            months: a.month(),
            date: a.date(),
            hours: a.hours(),
            minutes: a.minutes(),
            seconds: a.seconds(),
            milliseconds: a.milliseconds()
        }
    }

    function Jb() {
        return this.isValid() ? this.toISOString() : null
    }

    function Kb() {
        return k(this)
    }

    function Lb() {
        return g({}, j(this))
    }

    function Mb() {
        return j(this).overflow
    }

    function Nb() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        }
    }

    function Ob(a, b) {
        R(0, [a, a.length], 0, b)
    }

    function Pb(a) {
        return Tb.call(this, a, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy)
    }

    function Qb(a) {
        return Tb.call(this, a, this.isoWeek(), this.isoWeekday(), 1, 4)
    }

    function Rb() {
        return wa(this.year(), 1, 4)
    }

    function Sb() {
        var a = this.localeData()._week;
        return wa(this.year(), a.dow, a.doy)
    }

    function Tb(a, b, c, d, e) {
        var f;
        return null == a ? va(this, d, e).year : (f = wa(a, d, e), b > f && (b = f), Ub.call(this, a, b, c, d, e))
    }

    function Ub(a, b, c, d, e) {
        var f = ua(a, b, c, d, e),
            g = pa(f.year, 0, f.dayOfYear);
        return this.year(g.getUTCFullYear()), this.month(g.getUTCMonth()), this.date(g.getUTCDate()), this
    }

    function Vb(a) {
        return null == a ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (a - 1) + this.month() % 3)
    }

    function Wb(a) {
        return va(a, this._week.dow, this._week.doy).week
    }

    function Xb() {
        return this._week.dow
    }

    function Yb() {
        return this._week.doy
    }

    function Zb(a) {
        var b = this.localeData().week(this);
        return null == a ? b : this.add(7 * (a - b), "d")
    }

    function $b(a) {
        var b = va(this, 1, 4).week;
        return null == a ? b : this.add(7 * (a - b), "d")
    }

    function _b(a, b) {
        return "string" != typeof a ? a : isNaN(a) ? (a = b.weekdaysParse(a), "number" == typeof a ? a : null) : parseInt(a, 10)
    }

    function ac(a, b) {
        return c(this._weekdays) ? this._weekdays[a.day()] : this._weekdays[this._weekdays.isFormat.test(b) ? "format" : "standalone"][a.day()]
    }

    function bc(a) {
        return this._weekdaysShort[a.day()]
    }

    function cc(a) {
        return this._weekdaysMin[a.day()]
    }

    function dc(a, b, c) {
        var d, e, f;
        for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), d = 0; 7 > d; d++) {
            if (e = Ja([2e3, 1]).day(d), c && !this._fullWeekdaysParse[d] && (this._fullWeekdaysParse[d] = new RegExp("^" + this.weekdays(e, "").replace(".", ".?") + "$", "i"), this._shortWeekdaysParse[d] = new RegExp("^" + this.weekdaysShort(e, "").replace(".", ".?") + "$", "i"), this._minWeekdaysParse[d] = new RegExp("^" + this.weekdaysMin(e, "").replace(".", ".?") + "$", "i")), this._weekdaysParse[d] || (f = "^" + this.weekdays(e, "") + "|^" + this.weekdaysShort(e, "") + "|^" + this.weekdaysMin(e, ""), this._weekdaysParse[d] = new RegExp(f.replace(".", ""), "i")), c && "dddd" === b && this._fullWeekdaysParse[d].test(a)) return d;
            if (c && "ddd" === b && this._shortWeekdaysParse[d].test(a)) return d;
            if (c && "dd" === b && this._minWeekdaysParse[d].test(a)) return d;
            if (!c && this._weekdaysParse[d].test(a)) return d
        }
    }

    function ec(a) {
        if (!this.isValid()) return null != a ? this : NaN;
        var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        return null != a ? (a = _b(a, this.localeData()), this.add(a - b, "d")) : b
    }

    function fc(a) {
        if (!this.isValid()) return null != a ? this : NaN;
        var b = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return null == a ? b : this.add(a - b, "d")
    }

    function gc(a) {
        return this.isValid() ? null == a ? this.day() || 7 : this.day(this.day() % 7 ? a : a - 7) : null != a ? this : NaN
    }

    function hc(a) {
        var b = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return null == a ? b : this.add(a - b, "d")
    }

    function ic() {
        return this.hours() % 12 || 12
    }

    function jc(a, b) {
        R(a, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), b)
        })
    }

    function kc(a, b) {
        return b._meridiemParse
    }

    function lc(a) {
        return "p" === (a + "").toLowerCase().charAt(0)
    }

    function mc(a, b, c) {
        return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM"
    }

    function nc(a, b) {
        b[Hd] = r(1e3 * ("0." + a))
    }

    function oc() {
        return this._isUTC ? "UTC" : ""
    }

    function pc() {
        return this._isUTC ? "Coordinated Universal Time" : ""
    }

    function qc(a) {
        return Ja(1e3 * a)
    }

    function rc() {
        return Ja.apply(null, arguments).parseZone()
    }

    function sc(a, b, c) {
        var d = this._calendar[a];
        return w(d) ? d.call(b, c) : d
    }

    function tc(a) {
        var b = this._longDateFormat[a],
            c = this._longDateFormat[a.toUpperCase()];
        return b || !c ? b : (this._longDateFormat[a] = c.replace(/MMMM|MM|DD|dddd/g, function (a) {
            return a.slice(1)
        }), this._longDateFormat[a])
    }

    function uc() {
        return this._invalidDate
    }

    function vc(a) {
        return this._ordinal.replace("%d", a)
    }

    function wc(a) {
        return a
    }

    function xc(a, b, c, d) {
        var e = this._relativeTime[c];
        return w(e) ? e(a, b, c, d) : e.replace(/%d/i, a)
    }

    function yc(a, b) {
        var c = this._relativeTime[a > 0 ? "future" : "past"];
        return w(c) ? c(b) : c.replace(/%s/i, b)
    }

    function zc(a, b, c, d) {
        var e = H(),
            f = h().set(d, b);
        return e[c](f, a)
    }

    function Ac(a, b, c, d, e) {
        if ("number" == typeof a && (b = a, a = void 0), a = a || "", null != b) return zc(a, b, c, e);
        var f, g = [];
        for (f = 0; d > f; f++) g[f] = zc(a, f, c, e);
        return g
    }

    function Bc(a, b) {
        return Ac(a, b, "months", 12, "month")
    }

    function Cc(a, b) {
        return Ac(a, b, "monthsShort", 12, "month")
    }

    function Dc(a, b) {
        return Ac(a, b, "weekdays", 7, "day")
    }

    function Ec(a, b) {
        return Ac(a, b, "weekdaysShort", 7, "day")
    }

    function Fc(a, b) {
        return Ac(a, b, "weekdaysMin", 7, "day")
    }

    function Gc() {
        var a = this._data;
        return this._milliseconds = xe(this._milliseconds), this._days = xe(this._days), this._months = xe(this._months), a.milliseconds = xe(a.milliseconds), a.seconds = xe(a.seconds), a.minutes = xe(a.minutes), a.hours = xe(a.hours), a.months = xe(a.months), a.years = xe(a.years), this
    }

    function Hc(a, b, c, d) {
        var e = cb(b, c);
        return a._milliseconds += d * e._milliseconds, a._days += d * e._days, a._months += d * e._months, a._bubble()
    }

    function Ic(a, b) {
        return Hc(this, a, b, 1)
    }

    function Jc(a, b) {
        return Hc(this, a, b, -1)
    }

    function Kc(a) {
        return 0 > a ? Math.floor(a) : Math.ceil(a)
    }

    function Lc() {
        var a, b, c, d, e, f = this._milliseconds,
            g = this._days,
            h = this._months,
            i = this._data;
        return f >= 0 && g >= 0 && h >= 0 || 0 >= f && 0 >= g && 0 >= h || (f += 864e5 * Kc(Nc(h) + g), g = 0, h = 0), i.milliseconds = f % 1e3, a = q(f / 1e3), i.seconds = a % 60, b = q(a / 60), i.minutes = b % 60, c = q(b / 60), i.hours = c % 24, g += q(c / 24), e = q(Mc(g)), h += e, g -= Kc(Nc(e)), d = q(h / 12), h %= 12, i.days = g, i.months = h, i.years = d, this
    }

    function Mc(a) {
        return 4800 * a / 146097
    }

    function Nc(a) {
        return 146097 * a / 4800
    }

    function Oc(a) {
        var b, c, d = this._milliseconds;
        if (a = K(a), "month" === a || "year" === a) return b = this._days + d / 864e5, c = this._months + Mc(b), "month" === a ? c : c / 12;
        switch (b = this._days + Math.round(Nc(this._months)), a) {
            case "week":
                return b / 7 + d / 6048e5;
            case "day":
                return b + d / 864e5;
            case "hour":
                return 24 * b + d / 36e5;
            case "minute":
                return 1440 * b + d / 6e4;
            case "second":
                return 86400 * b + d / 1e3;
            case "millisecond":
                return Math.floor(864e5 * b) + d;
            default:
                throw new Error("Unknown unit " + a)
        }
    }

    function Pc() {
        return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * r(this._months / 12)
    }

    function Qc(a) {
        return function () {
            return this.as(a)
        }
    }

    function Rc(a) {
        return a = K(a), this[a + "s"]()
    }

    function Sc(a) {
        return function () {
            return this._data[a]
        }
    }

    function Tc() {
        return q(this.days() / 7)
    }

    function Uc(a, b, c, d, e) {
        return e.relativeTime(b || 1, !!c, a, d)
    }

    function Vc(a, b, c) {
        var d = cb(a).abs(),
            e = Ne(d.as("s")),
            f = Ne(d.as("m")),
            g = Ne(d.as("h")),
            h = Ne(d.as("d")),
            i = Ne(d.as("M")),
            j = Ne(d.as("y")),
            k = e < Oe.s && ["s", e] || 1 >= f && ["m"] || f < Oe.m && ["mm", f] || 1 >= g && ["h"] || g < Oe.h && ["hh", g] || 1 >= h && ["d"] || h < Oe.d && ["dd", h] || 1 >= i && ["M"] || i < Oe.M && ["MM", i] || 1 >= j && ["y"] || ["yy", j];
        return k[2] = b, k[3] = +a > 0, k[4] = c, Uc.apply(null, k)
    }

    function Wc(a, b) {
        return void 0 === Oe[a] ? !1 : void 0 === b ? Oe[a] : (Oe[a] = b, !0)
    }

    function Xc(a) {
        var b = this.localeData(),
            c = Vc(this, !a, b);
        return a && (c = b.pastFuture(+this, c)), b.postformat(c)
    }

    function Yc() {
        var a, b, c, d = Pe(this._milliseconds) / 1e3,
            e = Pe(this._days),
            f = Pe(this._months);
        a = q(d / 60), b = q(a / 60), d %= 60, a %= 60, c = q(f / 12), f %= 12;
        var g = c,
            h = f,
            i = e,
            j = b,
            k = a,
            l = d,
            m = this.asSeconds();
        return m ? (0 > m ? "-" : "") + "P" + (g ? g + "Y" : "") + (h ? h + "M" : "") + (i ? i + "D" : "") + (j || k || l ? "T" : "") + (j ? j + "H" : "") + (k ? k + "M" : "") + (l ? l + "S" : "") : "P0D"
    }
    var Zc, $c = a.momentProperties = [],
        _c = !1,
        ad = {};
    a.suppressDeprecationWarnings = !1;
    var bd, cd = {},
        dd = {},
        ed = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        fd = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        gd = {},
        hd = {},
        id = /\d/,
        jd = /\d\d/,
        kd = /\d{3}/,
        ld = /\d{4}/,
        md = /[+-]?\d{6}/,
        nd = /\d\d?/,
        od = /\d\d\d\d?/,
        pd = /\d\d\d\d\d\d?/,
        qd = /\d{1,3}/,
        rd = /\d{1,4}/,
        sd = /[+-]?\d{1,6}/,
        td = /\d+/,
        ud = /[+-]?\d+/,
        vd = /Z|[+-]\d\d:?\d\d/gi,
        wd = /Z|[+-]\d\d(?::?\d\d)?/gi,
        xd = /[+-]?\d+(\.\d{1,3})?/,
        yd = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
        zd = {},
        Ad = {},
        Bd = 0,
        Cd = 1,
        Dd = 2,
        Ed = 3,
        Fd = 4,
        Gd = 5,
        Hd = 6,
        Id = 7,
        Jd = 8;
    R("M", ["MM", 2], "Mo", function () {
        return this.month() + 1
    }), R("MMM", 0, 0, function (a) {
        return this.localeData().monthsShort(this, a)
    }), R("MMMM", 0, 0, function (a) {
        return this.localeData().months(this, a)
    }), J("month", "M"), W("M", nd), W("MM", nd, jd), W("MMM", function (a, b) {
        return b.monthsShortRegex(a)
    }), W("MMMM", function (a, b) {
        return b.monthsRegex(a)
    }), $(["M", "MM"], function (a, b) {
        b[Cd] = r(a) - 1
    }), $(["MMM", "MMMM"], function (a, b, c, d) {
        var e = c._locale.monthsParse(a, d, c._strict);
        null != e ? b[Cd] = e : j(c).invalidMonth = a
    });
    var Kd = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/,
        Ld = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        Md = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        Nd = yd,
        Od = yd,
        Pd = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,
        Qd = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,
        Rd = /Z|[+-]\d\d(?::?\d\d)?/,
        Sd = [["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/], ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/], ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/], ["GGGG-[W]WW", /\d{4}-W\d\d/, !1], ["YYYY-DDD", /\d{4}-\d{3}/], ["YYYY-MM", /\d{4}-\d\d/, !1], ["YYYYYYMMDD", /[+-]\d{10}/], ["YYYYMMDD", /\d{8}/], ["GGGG[W]WWE", /\d{4}W\d{3}/], ["GGGG[W]WW", /\d{4}W\d{2}/, !1], ["YYYYDDD", /\d{7}/]],
        Td = [["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/], ["HH:mm:ss", /\d\d:\d\d:\d\d/], ["HH:mm", /\d\d:\d\d/], ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/], ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/], ["HHmmss", /\d\d\d\d\d\d/], ["HHmm", /\d\d\d\d/], ["HH", /\d\d/]],
        Ud = /^\/?Date\((\-?\d+)/i;
    a.createFromInputFallback = u("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function (a) {
        a._d = new Date(a._i + (a._useUTC ? " UTC" : ""))
    }), R("Y", 0, 0, function () {
        var a = this.year();
        return 9999 >= a ? "" + a : "+" + a
    }), R(0, ["YY", 2], 0, function () {
        return this.year() % 100
    }), R(0, ["YYYY", 4], 0, "year"), R(0, ["YYYYY", 5], 0, "year"), R(0, ["YYYYYY", 6, !0], 0, "year"), J("year", "y"), W("Y", ud), W("YY", nd, jd), W("YYYY", rd, ld), W("YYYYY", sd, md), W("YYYYYY", sd, md), $(["YYYYY", "YYYYYY"], Bd), $("YYYY", function (b, c) {
        c[Bd] = 2 === b.length ? a.parseTwoDigitYear(b) : r(b);
    }), $("YY", function (b, c) {
        c[Bd] = a.parseTwoDigitYear(b)
    }), $("Y", function (a, b) {
        b[Bd] = parseInt(a, 10)
    }), a.parseTwoDigitYear = function (a) {
        return r(a) + (r(a) > 68 ? 1900 : 2e3)
    };
    var Vd = M("FullYear", !1);
    a.ISO_8601 = function () {};
    var Wd = u("moment().min is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function () {
            var a = Ja.apply(null, arguments);
            return this.isValid() && a.isValid() ? this > a ? this : a : l()
        }),
        Xd = u("moment().max is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function () {
            var a = Ja.apply(null, arguments);
            return this.isValid() && a.isValid() ? a > this ? this : a : l()
        }),
        Yd = function () {
            return Date.now ? Date.now() : +new Date
        };
    Pa("Z", ":"), Pa("ZZ", ""), W("Z", wd), W("ZZ", wd), $(["Z", "ZZ"], function (a, b, c) {
        c._useUTC = !0, c._tzm = Qa(wd, a)
    });
    var Zd = /([\+\-]|\d\d)/gi;
    a.updateOffset = function () {};
    var $d = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/,
        _d = /^(-)?P(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)W)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?$/;
    cb.fn = Na.prototype;
    var ae = hb(1, "add"),
        be = hb(-1, "subtract");
    a.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    var ce = u("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (a) {
        return void 0 === a ? this.localeData() : this.locale(a)
    });
    R(0, ["gg", 2], 0, function () {
        return this.weekYear() % 100
    }), R(0, ["GG", 2], 0, function () {
        return this.isoWeekYear() % 100
    }), Ob("gggg", "weekYear"), Ob("ggggg", "weekYear"), Ob("GGGG", "isoWeekYear"), Ob("GGGGG", "isoWeekYear"), J("weekYear", "gg"), J("isoWeekYear", "GG"), W("G", ud), W("g", ud), W("GG", nd, jd), W("gg", nd, jd), W("GGGG", rd, ld), W("gggg", rd, ld), W("GGGGG", sd, md), W("ggggg", sd, md), _(["gggg", "ggggg", "GGGG", "GGGGG"], function (a, b, c, d) {
        b[d.substr(0, 2)] = r(a)
    }), _(["gg", "GG"], function (b, c, d, e) {
        c[e] = a.parseTwoDigitYear(b)
    }), R("Q", 0, "Qo", "quarter"), J("quarter", "Q"), W("Q", id), $("Q", function (a, b) {
        b[Cd] = 3 * (r(a) - 1)
    }), R("w", ["ww", 2], "wo", "week"), R("W", ["WW", 2], "Wo", "isoWeek"), J("week", "w"), J("isoWeek", "W"), W("w", nd), W("ww", nd, jd), W("W", nd), W("WW", nd, jd), _(["w", "ww", "W", "WW"], function (a, b, c, d) {
        b[d.substr(0, 1)] = r(a)
    });
    var de = {
        dow: 0,
        doy: 6
    };
    R("D", ["DD", 2], "Do", "date"), J("date", "D"), W("D", nd), W("DD", nd, jd), W("Do", function (a, b) {
        return a ? b._ordinalParse : b._ordinalParseLenient
    }), $(["D", "DD"], Dd), $("Do", function (a, b) {
        b[Dd] = r(a.match(nd)[0], 10)
    });
    var ee = M("Date", !0);
    R("d", 0, "do", "day"), R("dd", 0, 0, function (a) {
        return this.localeData().weekdaysMin(this, a)
    }), R("ddd", 0, 0, function (a) {
        return this.localeData().weekdaysShort(this, a)
    }), R("dddd", 0, 0, function (a) {
        return this.localeData().weekdays(this, a)
    }), R("e", 0, 0, "weekday"), R("E", 0, 0, "isoWeekday"), J("day", "d"), J("weekday", "e"), J("isoWeekday", "E"), W("d", nd), W("e", nd), W("E", nd), W("dd", yd), W("ddd", yd), W("dddd", yd), _(["dd", "ddd", "dddd"], function (a, b, c, d) {
        var e = c._locale.weekdaysParse(a, d, c._strict);
        null != e ? b.d = e : j(c).invalidWeekday = a
    }), _(["d", "e", "E"], function (a, b, c, d) {
        b[d] = r(a)
    });
    var fe = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        ge = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        he = "Su_Mo_Tu_We_Th_Fr_Sa".split("_");
    R("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), J("dayOfYear", "DDD"), W("DDD", qd), W("DDDD", kd), $(["DDD", "DDDD"], function (a, b, c) {
        c._dayOfYear = r(a)
    }), R("H", ["HH", 2], 0, "hour"), R("h", ["hh", 2], 0, ic), R("hmm", 0, 0, function () {
        return "" + ic.apply(this) + Q(this.minutes(), 2)
    }), R("hmmss", 0, 0, function () {
        return "" + ic.apply(this) + Q(this.minutes(), 2) + Q(this.seconds(), 2)
    }), R("Hmm", 0, 0, function () {
        return "" + this.hours() + Q(this.minutes(), 2)
    }), R("Hmmss", 0, 0, function () {
        return "" + this.hours() + Q(this.minutes(), 2) + Q(this.seconds(), 2)
    }), jc("a", !0), jc("A", !1), J("hour", "h"), W("a", kc), W("A", kc), W("H", nd), W("h", nd), W("HH", nd, jd), W("hh", nd, jd), W("hmm", od), W("hmmss", pd), W("Hmm", od), W("Hmmss", pd), $(["H", "HH"], Ed), $(["a", "A"], function (a, b, c) {
        c._isPm = c._locale.isPM(a), c._meridiem = a
    }), $(["h", "hh"], function (a, b, c) {
        b[Ed] = r(a), j(c).bigHour = !0
    }), $("hmm", function (a, b, c) {
        var d = a.length - 2;
        b[Ed] = r(a.substr(0, d)), b[Fd] = r(a.substr(d)), j(c).bigHour = !0
    }), $("hmmss", function (a, b, c) {
        var d = a.length - 4,
            e = a.length - 2;
        b[Ed] = r(a.substr(0, d)), b[Fd] = r(a.substr(d, 2)), b[Gd] = r(a.substr(e)), j(c).bigHour = !0
    }), $("Hmm", function (a, b, c) {
        var d = a.length - 2;
        b[Ed] = r(a.substr(0, d)), b[Fd] = r(a.substr(d))
    }), $("Hmmss", function (a, b, c) {
        var d = a.length - 4,
            e = a.length - 2;
        b[Ed] = r(a.substr(0, d)), b[Fd] = r(a.substr(d, 2)), b[Gd] = r(a.substr(e))
    });
    var ie = /[ap]\.?m?\.?/i,
        je = M("Hours", !0);
    R("m", ["mm", 2], 0, "minute"), J("minute", "m"), W("m", nd), W("mm", nd, jd), $(["m", "mm"], Fd);
    var ke = M("Minutes", !1);
    R("s", ["ss", 2], 0, "second"), J("second", "s"), W("s", nd), W("ss", nd, jd), $(["s", "ss"], Gd);
    var le = M("Seconds", !1);
    R("S", 0, 0, function () {
        return ~~(this.millisecond() / 100)
    }), R(0, ["SS", 2], 0, function () {
        return ~~(this.millisecond() / 10)
    }), R(0, ["SSS", 3], 0, "millisecond"), R(0, ["SSSS", 4], 0, function () {
        return 10 * this.millisecond()
    }), R(0, ["SSSSS", 5], 0, function () {
        return 100 * this.millisecond()
    }), R(0, ["SSSSSS", 6], 0, function () {
        return 1e3 * this.millisecond()
    }), R(0, ["SSSSSSS", 7], 0, function () {
        return 1e4 * this.millisecond()
    }), R(0, ["SSSSSSSS", 8], 0, function () {
        return 1e5 * this.millisecond()
    }), R(0, ["SSSSSSSSS", 9], 0, function () {
        return 1e6 * this.millisecond()
    }), J("millisecond", "ms"), W("S", qd, id), W("SS", qd, jd), W("SSS", qd, kd);
    var me;
    for (me = "SSSS"; me.length <= 9; me += "S") W(me, td);
    for (me = "S"; me.length <= 9; me += "S") $(me, nc);
    var ne = M("Milliseconds", !1);
    R("z", 0, 0, "zoneAbbr"), R("zz", 0, 0, "zoneName");
    var oe = o.prototype;
    oe.add = ae, oe.calendar = jb, oe.clone = kb, oe.diff = rb, oe.endOf = Db, oe.format = vb, oe.from = wb, oe.fromNow = xb, oe.to = yb, oe.toNow = zb, oe.get = P, oe.invalidAt = Mb, oe.isAfter = lb, oe.isBefore = mb, oe.isBetween = nb, oe.isSame = ob, oe.isSameOrAfter = pb, oe.isSameOrBefore = qb, oe.isValid = Kb, oe.lang = ce, oe.locale = Ab, oe.localeData = Bb, oe.max = Xd, oe.min = Wd, oe.parsingFlags = Lb, oe.set = P, oe.startOf = Cb, oe.subtract = be, oe.toArray = Hb, oe.toObject = Ib, oe.toDate = Gb, oe.toISOString = ub, oe.toJSON = Jb, oe.toString = tb, oe.unix = Fb, oe.valueOf = Eb, oe.creationData = Nb, oe.year = Vd, oe.isLeapYear = sa, oe.weekYear = Pb, oe.isoWeekYear = Qb, oe.quarter = oe.quarters = Vb, oe.month = ga, oe.daysInMonth = ha, oe.week = oe.weeks = Zb, oe.isoWeek = oe.isoWeeks = $b, oe.weeksInYear = Sb, oe.isoWeeksInYear = Rb, oe.date = ee, oe.day = oe.days = ec, oe.weekday = fc, oe.isoWeekday = gc, oe.dayOfYear = hc, oe.hour = oe.hours = je, oe.minute = oe.minutes = ke, oe.second = oe.seconds = le, oe.millisecond = oe.milliseconds = ne, oe.utcOffset = Ta, oe.utc = Va, oe.local = Wa, oe.parseZone = Xa, oe.hasAlignedHourOffset = Ya, oe.isDST = Za, oe.isDSTShifted = $a, oe.isLocal = _a, oe.isUtcOffset = ab, oe.isUtc = bb, oe.isUTC = bb, oe.zoneAbbr = oc, oe.zoneName = pc, oe.dates = u("dates accessor is deprecated. Use date instead.", ee), oe.months = u("months accessor is deprecated. Use month instead", ga), oe.years = u("years accessor is deprecated. Use year instead", Vd), oe.zone = u("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779", Ua);
    var pe = oe,
        qe = {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        re = {
            LTS: "h:mm:ss A",
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D, YYYY",
            LLL: "MMMM D, YYYY h:mm A",
            LLLL: "dddd, MMMM D, YYYY h:mm A"
        },
        se = "Invalid date",
        te = "%d",
        ue = /\d{1,2}/,
        ve = {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        we = A.prototype;
    we._calendar = qe, we.calendar = sc, we._longDateFormat = re, we.longDateFormat = tc, we._invalidDate = se, we.invalidDate = uc, we._ordinal = te, we.ordinal = vc, we._ordinalParse = ue, we.preparse = wc, we.postformat = wc, we._relativeTime = ve, we.relativeTime = xc, we.pastFuture = yc, we.set = y, we.months = ca, we._months = Ld, we.monthsShort = da, we._monthsShort = Md, we.monthsParse = ea, we._monthsRegex = Od, we.monthsRegex = ja, we._monthsShortRegex = Nd, we.monthsShortRegex = ia, we.week = Wb, we._week = de, we.firstDayOfYear = Yb, we.firstDayOfWeek = Xb, we.weekdays = ac, we._weekdays = fe, we.weekdaysMin = cc, we._weekdaysMin = he, we.weekdaysShort = bc, we._weekdaysShort = ge, we.weekdaysParse = dc, we.isPM = lc, we._meridiemParse = ie, we.meridiem = mc, E("en", {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (a) {
            var b = a % 10,
                c = 1 === r(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return a + c
        }
    }), a.lang = u("moment.lang is deprecated. Use moment.locale instead.", E), a.langData = u("moment.langData is deprecated. Use moment.localeData instead.", H);
    var xe = Math.abs,
        ye = Qc("ms"),
        ze = Qc("s"),
        Ae = Qc("m"),
        Be = Qc("h"),
        Ce = Qc("d"),
        De = Qc("w"),
        Ee = Qc("M"),
        Fe = Qc("y"),
        Ge = Sc("milliseconds"),
        He = Sc("seconds"),
        Ie = Sc("minutes"),
        Je = Sc("hours"),
        Ke = Sc("days"),
        Le = Sc("months"),
        Me = Sc("years"),
        Ne = Math.round,
        Oe = {
            s: 45,
            m: 45,
            h: 22,
            d: 26,
            M: 11
        },
        Pe = Math.abs,
        Qe = Na.prototype;
    Qe.abs = Gc, Qe.add = Ic, Qe.subtract = Jc, Qe.as = Oc, Qe.asMilliseconds = ye, Qe.asSeconds = ze, Qe.asMinutes = Ae, Qe.asHours = Be, Qe.asDays = Ce, Qe.asWeeks = De, Qe.asMonths = Ee, Qe.asYears = Fe, Qe.valueOf = Pc, Qe._bubble = Lc, Qe.get = Rc, Qe.milliseconds = Ge, Qe.seconds = He, Qe.minutes = Ie, Qe.hours = Je, Qe.days = Ke, Qe.weeks = Tc, Qe.months = Le, Qe.years = Me, Qe.humanize = Xc, Qe.toISOString = Yc, Qe.toString = Yc, Qe.toJSON = Yc, Qe.locale = Ab, Qe.localeData = Bb, Qe.toIsoString = u("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", Yc), Qe.lang = ce, R("X", 0, 0, "unix"), R("x", 0, 0, "valueOf"), W("x", ud), W("X", xd), $("X", function (a, b, c) {
        c._d = new Date(1e3 * parseFloat(a, 10))
    }), $("x", function (a, b, c) {
        c._d = new Date(r(a))
    }), a.version = "2.12.0", b(Ja), a.fn = pe, a.min = La, a.max = Ma, a.now = Yd, a.utc = h, a.unix = qc, a.months = Bc, a.isDate = d, a.locale = E, a.invalid = l, a.duration = cb, a.isMoment = p, a.weekdays = Dc, a.parseZone = rc, a.localeData = H, a.isDuration = Oa, a.monthsShort = Cc, a.weekdaysMin = Fc, a.defineLocale = F, a.updateLocale = G, a.locales = I, a.weekdaysShort = Ec, a.normalizeUnits = K, a.relativeTimeThreshold = Wc, a.prototype = pe;
    var Re = a;
    return Re
});
/*!
 * FullCalendar v3.10.2
 * Docs & License: https://fullcalendar.io/
 * (c) 2019 Adam Shaw
 */
! function (t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e(require("moment"), require("jquery")) : "function" == typeof define && define.amd ? define(["moment", "jquery"], e) : "object" == typeof exports ? exports.FullCalendar = e(require("moment"), require("jquery")) : t.FullCalendar = e(t.moment, t.jQuery)
}("undefined" != typeof self ? self : this, function (t, e) {
    return function (t) {
        function e(r) {
            if (n[r]) return n[r].exports;
            var i = n[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return t[r].call(i.exports, i, i.exports, e), i.l = !0, i.exports
        }
        var n = {};
        return e.m = t, e.c = n, e.d = function (t, n, r) {
            e.o(t, n) || Object.defineProperty(t, n, {
                configurable: !1,
                enumerable: !0,
                get: r
            })
        }, e.n = function (t) {
            var n = t && t.__esModule ? function () {
                return t.default
            } : function () {
                return t
            };
            return e.d(n, "a", n), n
        }, e.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, e.p = "", e(e.s = 256)
    }([function (e, n) {
        e.exports = t
    }, , function (t, e) {
        var n = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function (t, e) {
            t.__proto__ = e
        } || function (t, e) {
            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
        };
        e.__extends = function (t, e) {
            function r() {
                this.constructor = t
            }
            n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r)
        }
    }, function (t, n) {
        t.exports = e
    }, function (t, e, n) {
        function r(t, e) {
            e.left && t.css({
                "border-left-width": 1,
                "margin-left": e.left - 1
            }), e.right && t.css({
                "border-right-width": 1,
                "margin-right": e.right - 1
            })
        }

        function i(t) {
            t.css({
                "margin-left": "",
                "margin-right": "",
                "border-left-width": "",
                "border-right-width": ""
            })
        }

        function o() {
            ht("body").addClass("fc-not-allowed")
        }

        function s() {
            ht("body").removeClass("fc-not-allowed")
        }

        function a(t, e, n) {
            var r = Math.floor(e / t.length),
                i = Math.floor(e - r * (t.length - 1)),
                o = [],
                s = [],
                a = [],
                u = 0;
            l(t), t.each(function (e, n) {
                var l = e === t.length - 1 ? i : r,
                    d = ht(n).outerHeight(!0);
                d < l ? (o.push(n), s.push(d), a.push(ht(n).height())) : u += d
            }), n && (e -= u, r = Math.floor(e / o.length), i = Math.floor(e - r * (o.length - 1))), ht(o).each(function (t, e) {
                var n = t === o.length - 1 ? i : r,
                    l = s[t],
                    u = a[t],
                    d = n - (l - u);
                l < n && ht(e).height(d)
            })
        }

        function l(t) {
            t.height("")
        }

        function u(t) {
            var e = 0;
            return t.find("> *").each(function (t, n) {
                var r = ht(n).outerWidth();
                r > e && (e = r)
            }), e++, t.width(e), e
        }

        function d(t, e) {
            var n, r = t.add(e);
            return r.css({
                position: "relative",
                left: -1
            }), n = t.outerHeight() - e.outerHeight(), r.css({
                position: "",
                left: ""
            }), n
        }

        function c(t) {
            var e = t.css("position"),
                n = t.parents().filter(function () {
                    var t = ht(this);
                    return /(auto|scroll)/.test(t.css("overflow") + t.css("overflow-y") + t.css("overflow-x"))
                }).eq(0);
            return "fixed" !== e && n.length ? n : ht(t[0].ownerDocument || document)
        }

        function p(t, e) {
            var n = t.offset(),
                r = n.left - (e ? e.left : 0),
                i = n.top - (e ? e.top : 0);
            return {
                left: r,
                right: r + t.outerWidth(),
                top: i,
                bottom: i + t.outerHeight()
            }
        }

        function h(t, e) {
            var n = t.offset(),
                r = g(t),
                i = n.left + b(t, "border-left-width") + r.left - (e ? e.left : 0),
                o = n.top + b(t, "border-top-width") + r.top - (e ? e.top : 0);
            return {
                left: i,
                right: i + t[0].clientWidth,
                top: o,
                bottom: o + t[0].clientHeight
            }
        }

        function f(t, e) {
            var n = t.offset(),
                r = n.left + b(t, "border-left-width") + b(t, "padding-left") - (e ? e.left : 0),
                i = n.top + b(t, "border-top-width") + b(t, "padding-top") - (e ? e.top : 0);
            return {
                left: r,
                right: r + t.width(),
                top: i,
                bottom: i + t.height()
            }
        }

        function g(t) {
            var e, n = t[0].offsetWidth - t[0].clientWidth,
                r = t[0].offsetHeight - t[0].clientHeight;
            return n = v(n), r = v(r), e = {
                left: 0,
                right: 0,
                top: 0,
                bottom: r
            }, y() && "rtl" === t.css("direction") ? e.left = n : e.right = n, e
        }

        function v(t) {
            return t = Math.max(0, t), t = Math.round(t)
        }

        function y() {
            return null === ft && (ft = m()), ft
        }

        function m() {
            var t = ht("<div><div></div></div>").css({
                    position: "absolute",
                    top: -1e3,
                    left: 0,
                    border: 0,
                    padding: 0,
                    overflow: "scroll",
                    direction: "rtl"
                }).appendTo("body"),
                e = t.children(),
                n = e.offset().left > t.offset().left;
            return t.remove(), n
        }

        function b(t, e) {
            return parseFloat(t.css(e)) || 0
        }

        function w(t) {
            return 1 === t.which && !t.ctrlKey
        }

        function D(t) {
            var e = t.originalEvent.touches;
            return e && e.length ? e[0].pageX : t.pageX
        }

        function E(t) {
            var e = t.originalEvent.touches;
            return e && e.length ? e[0].pageY : t.pageY
        }

        function S(t) {
            return /^touch/.test(t.type)
        }

        function C(t) {
            t.addClass("fc-unselectable").on("selectstart", T)
        }

        function R(t) {
            t.removeClass("fc-unselectable").off("selectstart", T)
        }

        function T(t) {
            t.preventDefault()
        }

        function M(t, e) {
            var n = {
                left: Math.max(t.left, e.left),
                right: Math.min(t.right, e.right),
                top: Math.max(t.top, e.top),
                bottom: Math.min(t.bottom, e.bottom)
            };
            return n.left < n.right && n.top < n.bottom && n
        }

        function I(t, e) {
            return {
                left: Math.min(Math.max(t.left, e.left), e.right),
                top: Math.min(Math.max(t.top, e.top), e.bottom)
            }
        }

        function H(t) {
            return {
                left: (t.left + t.right) / 2,
                top: (t.top + t.bottom) / 2
            }
        }

        function P(t, e) {
            return {
                left: t.left - e.left,
                top: t.top - e.top
            }
        }

        function _(t) {
            var e, n, r = [],
                i = [];
            for ("string" == typeof t ? i = t.split(/\s*,\s*/) : "function" == typeof t ? i = [t] : ht.isArray(t) && (i = t), e = 0; e < i.length; e++) n = i[e], "string" == typeof n ? r.push("-" === n.charAt(0) ? {
                field: n.substring(1),
                order: -1
            } : {
                field: n,
                order: 1
            }) : "function" == typeof n && r.push({
                func: n
            });
            return r
        }

        function x(t, e, n, r, i) {
            var o, s;
            for (o = 0; o < n.length; o++)
                if (s = O(t, e, n[o], r, i)) return s;
            return 0
        }

        function O(t, e, n, r, i) {
            if (n.func) return n.func(t, e);
            var o = t[n.field],
                s = e[n.field];
            return null == o && r && (o = r[n.field]), null == s && i && (s = i[n.field]), F(o, s) * (n.order || 1)
        }

        function F(t, e) {
            return t || e ? null == e ? -1 : null == t ? 1 : "string" === ht.type(t) || "string" === ht.type(e) ? String(t).localeCompare(String(e)) : t - e : 0
        }

        function z(t, e) {
            return pt.duration({
                days: t.clone().stripTime().diff(e.clone().stripTime(), "days"),
                ms: t.time() - e.time()
            })
        }

        function B(t, e) {
            return pt.duration({
                days: t.clone().stripTime().diff(e.clone().stripTime(), "days")
            })
        }

        function A(t, e, n) {
            return pt.duration(Math.round(t.diff(e, n, !0)), n)
        }

        function k(t, n) {
            var r, i, o;
            for (r = 0; r < e.unitsDesc.length && (i = e.unitsDesc[r], !((o = V(i, t, n)) >= 1 && ut(o))); r++);
            return i
        }

        function L(t, e) {
            var n = k(t);
            return "week" === n && "object" == typeof e && e.days && (n = "day"), n
        }

        function V(t, e, n) {
            return null != n ? n.diff(e, t, !0) : pt.isDuration(e) ? e.as(t) : e.end.diff(e.start, t, !0)
        }

        function G(t, e, n) {
            var r;
            return U(n) ? (e - t) / n : (r = n.asMonths(), Math.abs(r) >= 1 && ut(r) ? e.diff(t, "months", !0) / r : e.diff(t, "days", !0) / n.asDays())
        }

        function N(t, e) {
            var n, r;
            return U(t) || U(e) ? t / e : (n = t.asMonths(), r = e.asMonths(), Math.abs(n) >= 1 && ut(n) && Math.abs(r) >= 1 && ut(r) ? n / r : t.asDays() / e.asDays())
        }

        function j(t, e) {
            var n;
            return U(t) ? pt.duration(t * e) : (n = t.asMonths(), Math.abs(n) >= 1 && ut(n) ? pt.duration({
                months: n * e
            }) : pt.duration({
                days: t.asDays() * e
            }))
        }

        function U(t) {
            return Boolean(t.hours() || t.minutes() || t.seconds() || t.milliseconds())
        }

        function W(t) {
            return "[object Date]" === Object.prototype.toString.call(t) || t instanceof Date
        }

        function q(t) {
            return "string" == typeof t && /^\d+\:\d+(?:\:\d+\.?(?:\d{3})?)?$/.test(t)
        }

        function Y() {
            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
            var n = window.console;
            if (n && n.log) return n.log.apply(n, t)
        }

        function Z() {
            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
            var n = window.console;
            return n && n.warn ? n.warn.apply(n, t) : Y.apply(null, t)
        }

        function X(t, e) {
            var n, r, i, o, s, a, l = {};
            if (e)
                for (n = 0; n < e.length; n++) {
                    for (r = e[n], i = [], o = t.length - 1; o >= 0; o--)
                        if ("object" == typeof (s = t[o][r])) i.unshift(s);
                        else if (void 0 !== s) {
                        l[r] = s;
                        break
                    }
                    i.length && (l[r] = X(i))
                }
            for (n = t.length - 1; n >= 0; n--) {
                a = t[n];
                for (r in a) r in l || (l[r] = a[r])
            }
            return l
        }

        function Q(t, e) {
            for (var n in t) $(t, n) && (e[n] = t[n])
        }

        function $(t, e) {
            return gt.call(t, e)
        }

        function K(t, e, n) {
            if (ht.isFunction(t) && (t = [t]), t) {
                var r = void 0,
                    i = void 0;
                for (r = 0; r < t.length; r++) i = t[r].apply(e, n) || i;
                return i
            }
        }

        function J(t, e) {
            for (var n = 0, r = 0; r < t.length;) e(t[r]) ? (t.splice(r, 1), n++) : r++;
            return n
        }

        function tt(t, e) {
            for (var n = 0, r = 0; r < t.length;) t[r] === e ? (t.splice(r, 1), n++) : r++;
            return n
        }

        function et(t, e) {
            var n, r = t.length;
            if (null == r || r !== e.length) return !1;
            for (n = 0; n < r; n++)
                if (t[n] !== e[n]) return !1;
            return !0
        }

        function nt() {
            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
            for (var n = 0; n < t.length; n++)
                if (void 0 !== t[n]) return t[n]
        }

        function rt(t) {
            return (t + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;").replace(/\n/g, "<br>")
        }

        function it(t) {
            return t.replace(/&.*?;/g, "")
        }

        function ot(t) {
            var e = [];
            return ht.each(t, function (t, n) {
                null != n && e.push(t + ":" + n)
            }), e.join(";")
        }

        function st(t) {
            var e = [];
            return ht.each(t, function (t, n) {
                null != n && e.push(t + '="' + rt(n) + '"')
            }), e.join(" ")
        }

        function at(t) {
            return t.charAt(0).toUpperCase() + t.slice(1)
        }

        function lt(t, e) {
            return t - e
        }

        function ut(t) {
            return t % 1 == 0
        }

        function dt(t, e) {
            var n = t[e];
            return function () {
                return n.apply(t, arguments)
            }
        }

        function ct(t, e, n) {
            void 0 === n && (n = !1);
            var r, i, o, s, a, l = function () {
                var u = +new Date - s;
                u < e ? r = setTimeout(l, e - u) : (r = null, n || (a = t.apply(o, i), o = i = null))
            };
            return function () {
                o = this, i = arguments, s = +new Date;
                var u = n && !r;
                return r || (r = setTimeout(l, e)), u && (a = t.apply(o, i), o = i = null), a
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var pt = n(0),
            ht = n(3);
        e.compensateScroll = r, e.uncompensateScroll = i, e.disableCursor = o, e.enableCursor = s, e.distributeHeight = a, e.undistributeHeight = l, e.matchCellWidths = u, e.subtractInnerElHeight = d, e.getScrollParent = c, e.getOuterRect = p, e.getClientRect = h, e.getContentRect = f, e.getScrollbarWidths = g;
        var ft = null;
        e.isPrimaryMouseButton = w, e.getEvX = D, e.getEvY = E, e.getEvIsTouch = S, e.preventSelection = C, e.allowSelection = R, e.preventDefault = T, e.intersectRects = M, e.constrainPoint = I, e.getRectCenter = H, e.diffPoints = P, e.parseFieldSpecs = _, e.compareByFieldSpecs = x, e.compareByFieldSpec = O, e.flexibleCompare = F, e.dayIDs = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], e.unitsDesc = ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"], e.diffDayTime = z, e.diffDay = B, e.diffByUnit = A, e.computeGreatestUnit = k, e.computeDurationGreatestUnit = L, e.divideRangeByDuration = G, e.divideDurationByDuration = N, e.multiplyDuration = j, e.durationHasTime = U, e.isNativeDate = W, e.isTimeString = q, e.log = Y, e.warn = Z;
        var gt = {}.hasOwnProperty;
        e.mergeProps = X, e.copyOwnProps = Q, e.hasOwnProp = $, e.applyAll = K, e.removeMatching = J, e.removeExact = tt, e.isArraysEqual = et, e.firstDefined = nt, e.htmlEscape = rt, e.stripHtmlEntities = it, e.cssToStr = ot, e.attrsToStr = st, e.capitaliseFirstLetter = at, e.compareNumbers = lt, e.isInt = ut, e.proxy = dt, e.debounce = ct
    }, function (t, e, n) {
        function r(t, e) {
            return t.startMs - e.startMs
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(0),
            o = n(11),
            s = function () {
                function t(t, e) {
                    this.isStart = !0, this.isEnd = !0, i.isMoment(t) && (t = t.clone().stripZone()), i.isMoment(e) && (e = e.clone().stripZone()), t && (this.startMs = t.valueOf()), e && (this.endMs = e.valueOf())
                }
                return t.invertRanges = function (e, n) {
                    var i, o, s = [],
                        a = n.startMs;
                    for (e.sort(r), i = 0; i < e.length; i++) o = e[i], o.startMs > a && s.push(new t(a, o.startMs)), o.endMs > a && (a = o.endMs);
                    return a < n.endMs && s.push(new t(a, n.endMs)), s
                }, t.prototype.intersect = function (e) {
                    var n = this.startMs,
                        r = this.endMs,
                        i = null;
                    return null != e.startMs && (n = null == n ? e.startMs : Math.max(n, e.startMs)), null != e.endMs && (r = null == r ? e.endMs : Math.min(r, e.endMs)), (null == n || null == r || n < r) && (i = new t(n, r), i.isStart = this.isStart && n === this.startMs, i.isEnd = this.isEnd && r === this.endMs), i
                }, t.prototype.intersectsWith = function (t) {
                    return (null == this.endMs || null == t.startMs || this.endMs > t.startMs) && (null == this.startMs || null == t.endMs || this.startMs < t.endMs)
                }, t.prototype.containsRange = function (t) {
                    return (null == this.startMs || null != t.startMs && t.startMs >= this.startMs) && (null == this.endMs || null != t.endMs && t.endMs <= this.endMs)
                }, t.prototype.containsDate = function (t) {
                    var e = t.valueOf();
                    return (null == this.startMs || e >= this.startMs) && (null == this.endMs || e < this.endMs)
                }, t.prototype.constrainDate = function (t) {
                    var e = t.valueOf();
                    return null != this.startMs && e < this.startMs && (e = this.startMs), null != this.endMs && e >= this.endMs && (e = this.endMs - 1), e
                }, t.prototype.equals = function (t) {
                    return this.startMs === t.startMs && this.endMs === t.endMs
                }, t.prototype.clone = function () {
                    var e = new t(this.startMs, this.endMs);
                    return e.isStart = this.isStart, e.isEnd = this.isEnd, e
                }, t.prototype.getStart = function () {
                    return null != this.startMs ? o.default.utc(this.startMs).stripZone() : null
                }, t.prototype.getEnd = function () {
                    return null != this.endMs ? o.default.utc(this.endMs).stripZone() : null
                }, t.prototype.as = function (t) {
                    return i.utc(this.endMs).diff(i.utc(this.startMs), t, !0)
                }, t
            }();
        e.default = s
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(52),
            s = n(35),
            a = n(36),
            l = function (t) {
                function e(n) {
                    var r = t.call(this) || this;
                    return r.calendar = n, r.className = [], r.uid = String(e.uuid++), r
                }
                return r.__extends(e, t), e.parse = function (t, e) {
                    var n = new this(e);
                    return !("object" != typeof t || !n.applyProps(t)) && n
                }, e.normalizeId = function (t) {
                    return t ? String(t) : null
                }, e.prototype.fetch = function (t, e, n) {}, e.prototype.removeEventDefsById = function (t) {}, e.prototype.removeAllEventDefs = function () {}, e.prototype.getPrimitive = function (t) {}, e.prototype.parseEventDefs = function (t) {
                    var e, n, r = [];
                    for (e = 0; e < t.length; e++)(n = this.parseEventDef(t[e])) && r.push(n);
                    return r
                }, e.prototype.parseEventDef = function (t) {
                    var e = this.calendar.opt("eventDataTransform"),
                        n = this.eventDataTransform;
                    return e && (t = e(t, this.calendar)), n && (t = n(t, this.calendar)), a.default.parse(t, this)
                }, e.prototype.applyManualStandardProps = function (t) {
                    return null != t.id && (this.id = e.normalizeId(t.id)), i.isArray(t.className) ? this.className = t.className : "string" == typeof t.className && (this.className = t.className.split(/\s+/)), !0
                }, e.uuid = 0, e.defineStandardProps = o.default.defineStandardProps, e.copyVerbatimStandardProps = o.default.copyVerbatimStandardProps, e
            }(s.default);
        e.default = l, o.default.mixInto(l), l.defineStandardProps({
            id: !1,
            className: !1,
            color: !0,
            backgroundColor: !0,
            borderColor: !0,
            textColor: !0,
            editable: !0,
            startEditable: !0,
            durationEditable: !0,
            rendering: !0,
            overlap: !0,
            constraint: !0,
            allDayDefault: !0,
            eventDataTransform: !0
        })
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(15),
            s = 0,
            a = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.listenTo = function (t, e, n) {
                    if ("object" == typeof e)
                        for (var r in e) e.hasOwnProperty(r) && this.listenTo(t, r, e[r]);
                    else "string" == typeof e && t.on(e + "." + this.getListenerNamespace(), i.proxy(n, this))
                }, e.prototype.stopListeningTo = function (t, e) {
                    t.off((e || "") + "." + this.getListenerNamespace())
                }, e.prototype.getListenerNamespace = function () {
                    return null == this.listenerId && (this.listenerId = s++), "_listener" + this.listenerId
                }, e
            }(o.default);
        e.default = a
    }, , function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(37),
            o = n(53),
            s = n(16),
            a = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.buildInstances = function () {
                    return [this.buildInstance()]
                }, e.prototype.buildInstance = function () {
                    return new o.default(this, this.dateProfile)
                }, e.prototype.isAllDay = function () {
                    return this.dateProfile.isAllDay()
                }, e.prototype.clone = function () {
                    var e = t.prototype.clone.call(this);
                    return e.dateProfile = this.dateProfile, e
                }, e.prototype.rezone = function () {
                    var t = this.source.calendar,
                        e = this.dateProfile;
                    this.dateProfile = new s.default(t.moment(e.start), e.end ? t.moment(e.end) : null, t)
                }, e.prototype.applyManualStandardProps = function (e) {
                    var n = t.prototype.applyManualStandardProps.call(this, e),
                        r = s.default.parse(e, this.source);
                    return !!r && (this.dateProfile = r, null != e.date && (this.miscProps.date = e.date), n)
                }, e
            }(i.default);
        e.default = a, a.defineStandardProps({
            start: !1,
            date: !1,
            end: !1,
            allDay: !1
        })
    }, , function (t, e, n) {
        function r(t, e) {
            return c.format.call(t, e)
        }

        function i(t, e, n) {
            void 0 === e && (e = !1), void 0 === n && (n = !1);
            var r, i, d, c, p = t[0],
                h = 1 === t.length && "string" == typeof p;
            return o.isMoment(p) || a.isNativeDate(p) || void 0 === p ? c = o.apply(null, t) : (r = !1, i = !1, h ? l.test(p) ? (p += "-01", t = [p], r = !0, i = !0) : (d = u.exec(p)) && (r = !d[5], i = !0) : s.isArray(p) && (i = !0), c = e || r ? o.utc.apply(o, t) : o.apply(null, t), r ? (c._ambigTime = !0, c._ambigZone = !0) : n && (i ? c._ambigZone = !0 : h && c.utcOffset(p))), c._fullCalendar = !0, c
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = n(0),
            s = n(3),
            a = n(4),
            l = /^\s*\d{4}-\d\d$/,
            u = /^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?)?$/,
            d = o.fn;
        e.newMomentProto = d;
        var c = s.extend({}, d);
        e.oldMomentProto = c;
        var p = o.momentProperties;
        p.push("_fullCalendar"), p.push("_ambigTime"), p.push("_ambigZone"), e.oldMomentFormat = r;
        var h = function () {
            return i(arguments)
        };
        e.default = h, h.utc = function () {
            var t = i(arguments, !0);
            return t.hasTime() && t.utc(), t
        }, h.parseZone = function () {
            return i(arguments, !0, !0)
        }, d.week = d.weeks = function (t) {
            var e = this._locale._fullCalendar_weekCalc;
            return null == t && "function" == typeof e ? e(this) : "ISO" === e ? c.isoWeek.apply(this, arguments) : c.week.apply(this, arguments)
        }, d.time = function (t) {
            if (!this._fullCalendar) return c.time.apply(this, arguments);
            if (null == t) return o.duration({
                hours: this.hours(),
                minutes: this.minutes(),
                seconds: this.seconds(),
                milliseconds: this.milliseconds()
            });
            this._ambigTime = !1, o.isDuration(t) || o.isMoment(t) || (t = o.duration(t));
            var e = 0;
            return o.isDuration(t) && (e = 24 * Math.floor(t.asDays())), this.hours(e + t.hours()).minutes(t.minutes()).seconds(t.seconds()).milliseconds(t.milliseconds())
        }, d.stripTime = function () {
            return this._ambigTime || (this.utc(!0), this.set({
                hours: 0,
                minutes: 0,
                seconds: 0,
                ms: 0
            }), this._ambigTime = !0, this._ambigZone = !0), this
        }, d.hasTime = function () {
            return !this._ambigTime
        }, d.stripZone = function () {
            var t;
            return this._ambigZone || (t = this._ambigTime, this.utc(!0), this._ambigTime = t || !1, this._ambigZone = !0), this
        }, d.hasZone = function () {
            return !this._ambigZone
        }, d.local = function (t) {
            return c.local.call(this, this._ambigZone || t), this._ambigTime = !1, this._ambigZone = !1, this
        }, d.utc = function (t) {
            return c.utc.call(this, t), this._ambigTime = !1, this._ambigZone = !1, this
        }, d.utcOffset = function (t) {
            return null != t && (this._ambigTime = !1, this._ambigZone = !1), c.utcOffset.apply(this, arguments)
        }
    }, function (t, e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = function () {
            function t(t, e) {
                this.isAllDay = !1, this.unzonedRange = t, this.isAllDay = e
            }
            return t.prototype.toLegacy = function (t) {
                return {
                    start: t.msToMoment(this.unzonedRange.startMs, this.isAllDay),
                    end: t.msToMoment(this.unzonedRange.endMs, this.isAllDay)
                }
            }, t
        }();
        e.default = n
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(15),
            s = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.on = function (t, e) {
                    return i(this).on(t, this._prepareIntercept(e)), this
                }, e.prototype.one = function (t, e) {
                    return i(this).one(t, this._prepareIntercept(e)), this
                }, e.prototype._prepareIntercept = function (t) {
                    var e = function (e, n) {
                        return t.apply(n.context || this, n.args || [])
                    };
                    return t.guid || (t.guid = i.guid++), e.guid = t.guid, e
                }, e.prototype.off = function (t, e) {
                    return i(this).off(t, e), this
                }, e.prototype.trigger = function (t) {
                    for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                    return i(this).triggerHandler(t, {
                        args: e
                    }), this
                }, e.prototype.triggerWith = function (t, e, n) {
                    return i(this).triggerHandler(t, {
                        context: e,
                        args: n
                    }), this
                }, e.prototype.hasHandlers = function (t) {
                    var e = i._data(this, "events");
                    return e && e[t] && e[t].length > 0
                }, e
            }(o.default);
        e.default = s
    }, function (t, e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = function () {
            function t(t) {
                this.view = t._getView(), this.component = t
            }
            return t.prototype.opt = function (t) {
                return this.view.opt(t)
            }, t.prototype.end = function () {}, t
        }();
        e.default = n
    }, function (t, e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = function () {
            function t() {}
            return t.mixInto = function (t) {
                var e = this;
                Object.getOwnPropertyNames(this.prototype).forEach(function (n) {
                    t.prototype[n] || (t.prototype[n] = e.prototype[n])
                })
            }, t.mixOver = function (t) {
                var e = this;
                Object.getOwnPropertyNames(this.prototype).forEach(function (n) {
                    t.prototype[n] = e.prototype[n]
                })
            }, t
        }();
        e.default = n
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(5),
            i = function () {
                function t(t, e, n) {
                    this.start = t, this.end = e || null, this.unzonedRange = this.buildUnzonedRange(n)
                }
                return t.parse = function (e, n) {
                    var r = e.start || e.date,
                        i = e.end;
                    if (!r) return !1;
                    var o = n.calendar,
                        s = o.moment(r),
                        a = i ? o.moment(i) : null,
                        l = e.allDay,
                        u = o.opt("forceEventDuration");
                    return !!s.isValid() && (null == l && null == (l = n.allDayDefault) && (l = o.opt("allDayDefault")), !0 === l ? (s.stripTime(), a && a.stripTime()) : !1 === l && (s.hasTime() || s.time(0), a && !a.hasTime() && a.time(0)), !a || a.isValid() && a.isAfter(s) || (a = null), !a && u && (a = o.getDefaultEventEnd(!s.hasTime(), s)), new t(s, a, o))
                }, t.isStandardProp = function (t) {
                    return "start" === t || "date" === t || "end" === t || "allDay" === t
                }, t.prototype.isAllDay = function () {
                    return !(this.start.hasTime() || this.end && this.end.hasTime())
                }, t.prototype.buildUnzonedRange = function (t) {
                    var e = this.start.clone().stripZone().valueOf(),
                        n = this.getEnd(t).stripZone().valueOf();
                    return new r.default(e, n)
                }, t.prototype.getEnd = function (t) {
                    return this.end ? this.end.clone() : t.getDefaultEventEnd(this.isAllDay(), this.start)
                }, t
            }();
        e.default = i
    }, function (t, e, n) {
        function r(t, e) {
            return !t && !e || !(!t || !e) && (t.component === e.component && i(t, e) && i(e, t))
        }

        function i(t, e) {
            for (var n in t)
                if (!/^(component|left|right|top|bottom)$/.test(n) && t[n] !== e[n]) return !1;
            return !0
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = n(2),
            s = n(4),
            a = n(59),
            l = function (t) {
                function e(e, n) {
                    var r = t.call(this, n) || this;
                    return r.component = e, r
                }
                return o.__extends(e, t), e.prototype.handleInteractionStart = function (e) {
                    var n, r, i, o = this.subjectEl;
                    this.component.hitsNeeded(), this.computeScrollBounds(), e ? (r = {
                        left: s.getEvX(e),
                        top: s.getEvY(e)
                    }, i = r, o && (n = s.getOuterRect(o), i = s.constrainPoint(i, n)), this.origHit = this.queryHit(i.left, i.top), o && this.options.subjectCenter && (this.origHit && (n = s.intersectRects(this.origHit, n) || n), i = s.getRectCenter(n)), this.coordAdjust = s.diffPoints(i, r)) : (this.origHit = null, this.coordAdjust = null), t.prototype.handleInteractionStart.call(this, e)
                }, e.prototype.handleDragStart = function (e) {
                    var n;
                    t.prototype.handleDragStart.call(this, e), (n = this.queryHit(s.getEvX(e), s.getEvY(e))) && this.handleHitOver(n)
                }, e.prototype.handleDrag = function (e, n, i) {
                    var o;
                    t.prototype.handleDrag.call(this, e, n, i), o = this.queryHit(s.getEvX(i), s.getEvY(i)), r(o, this.hit) || (this.hit && this.handleHitOut(), o && this.handleHitOver(o))
                }, e.prototype.handleDragEnd = function (e) {
                    this.handleHitDone(), t.prototype.handleDragEnd.call(this, e)
                }, e.prototype.handleHitOver = function (t) {
                    var e = r(t, this.origHit);
                    this.hit = t, this.trigger("hitOver", this.hit, e, this.origHit)
                }, e.prototype.handleHitOut = function () {
                    this.hit && (this.trigger("hitOut", this.hit), this.handleHitDone(), this.hit = null)
                }, e.prototype.handleHitDone = function () {
                    this.hit && this.trigger("hitDone", this.hit)
                }, e.prototype.handleInteractionEnd = function (e, n) {
                    t.prototype.handleInteractionEnd.call(this, e, n), this.origHit = null, this.hit = null, this.component.hitsNotNeeded()
                }, e.prototype.handleScrollEnd = function () {
                    t.prototype.handleScrollEnd.call(this), this.isDragging && (this.component.releaseHits(), this.component.prepareHits())
                }, e.prototype.queryHit = function (t, e) {
                    return this.coordAdjust && (t += this.coordAdjust.left, e += this.coordAdjust.top), this.component.queryHit(t, e)
                }, e
            }(a.default);
        e.default = l
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.version = "3.10.2", e.internalApiVersion = 12;
        var r = n(4);
        e.applyAll = r.applyAll, e.debounce = r.debounce, e.isInt = r.isInt, e.htmlEscape = r.htmlEscape, e.cssToStr = r.cssToStr, e.proxy = r.proxy, e.capitaliseFirstLetter = r.capitaliseFirstLetter, e.getOuterRect = r.getOuterRect, e.getClientRect = r.getClientRect, e.getContentRect = r.getContentRect, e.getScrollbarWidths = r.getScrollbarWidths, e.preventDefault = r.preventDefault, e.parseFieldSpecs = r.parseFieldSpecs, e.compareByFieldSpecs = r.compareByFieldSpecs, e.compareByFieldSpec = r.compareByFieldSpec, e.flexibleCompare = r.flexibleCompare, e.computeGreatestUnit = r.computeGreatestUnit, e.divideRangeByDuration = r.divideRangeByDuration, e.divideDurationByDuration = r.divideDurationByDuration, e.multiplyDuration = r.multiplyDuration, e.durationHasTime = r.durationHasTime, e.log = r.log, e.warn = r.warn, e.removeExact = r.removeExact, e.intersectRects = r.intersectRects, e.allowSelection = r.allowSelection, e.attrsToStr = r.attrsToStr, e.compareNumbers = r.compareNumbers, e.compensateScroll = r.compensateScroll, e.computeDurationGreatestUnit = r.computeDurationGreatestUnit, e.constrainPoint = r.constrainPoint, e.copyOwnProps = r.copyOwnProps, e.diffByUnit = r.diffByUnit, e.diffDay = r.diffDay, e.diffDayTime = r.diffDayTime, e.diffPoints = r.diffPoints, e.disableCursor = r.disableCursor, e.distributeHeight = r.distributeHeight, e.enableCursor = r.enableCursor, e.firstDefined = r.firstDefined, e.getEvIsTouch = r.getEvIsTouch, e.getEvX = r.getEvX, e.getEvY = r.getEvY, e.getRectCenter = r.getRectCenter, e.getScrollParent = r.getScrollParent, e.hasOwnProp = r.hasOwnProp, e.isArraysEqual = r.isArraysEqual, e.isNativeDate = r.isNativeDate, e.isPrimaryMouseButton = r.isPrimaryMouseButton, e.isTimeString = r.isTimeString, e.matchCellWidths = r.matchCellWidths, e.mergeProps = r.mergeProps, e.preventSelection = r.preventSelection, e.removeMatching = r.removeMatching, e.stripHtmlEntities = r.stripHtmlEntities, e.subtractInnerElHeight = r.subtractInnerElHeight, e.uncompensateScroll = r.uncompensateScroll, e.undistributeHeight = r.undistributeHeight, e.dayIDs = r.dayIDs, e.unitsDesc = r.unitsDesc;
        var i = n(49);
        e.formatDate = i.formatDate, e.formatRange = i.formatRange, e.queryMostGranularFormatUnit = i.queryMostGranularFormatUnit;
        var o = n(32);
        e.datepickerLocale = o.datepickerLocale, e.locale = o.locale, e.getMomentLocaleData = o.getMomentLocaleData, e.populateInstanceComputableOptions = o.populateInstanceComputableOptions;
        var s = n(19);
        e.eventDefsToEventInstances = s.eventDefsToEventInstances, e.eventFootprintToComponentFootprint = s.eventFootprintToComponentFootprint, e.eventInstanceToEventRange = s.eventInstanceToEventRange, e.eventInstanceToUnzonedRange = s.eventInstanceToUnzonedRange, e.eventRangeToEventFootprint = s.eventRangeToEventFootprint;
        var a = n(11);
        e.moment = a.default;
        var l = n(13);
        e.EmitterMixin = l.default;
        var u = n(7);
        e.ListenerMixin = u.default;
        var d = n(51);
        e.Model = d.default;
        var c = n(217);
        e.Constraints = c.default;
        var p = n(55);
        e.DateProfileGenerator = p.default;
        var h = n(5);
        e.UnzonedRange = h.default;
        var f = n(12);
        e.ComponentFootprint = f.default;
        var g = n(218);
        e.BusinessHourGenerator = g.default;
        var v = n(219);
        e.EventPeriod = v.default;
        var y = n(220);
        e.EventManager = y.default;
        var m = n(37);
        e.EventDef = m.default;
        var b = n(39);
        e.EventDefMutation = b.default;
        var w = n(36);
        e.EventDefParser = w.default;
        var D = n(53);
        e.EventInstance = D.default;
        var E = n(50);
        e.EventRange = E.default;
        var S = n(54);
        e.RecurringEventDef = S.default;
        var C = n(9);
        e.SingleEventDef = C.default;
        var R = n(40);
        e.EventDefDateMutation = R.default;
        var T = n(16);
        e.EventDateProfile = T.default;
        var M = n(38);
        e.EventSourceParser = M.default;
        var I = n(6);
        e.EventSource = I.default;
        var H = n(57);
        e.defineThemeSystem = H.defineThemeSystem, e.getThemeSystemClass = H.getThemeSystemClass;
        var P = n(20);
        e.EventInstanceGroup = P.default;
        var _ = n(56);
        e.ArrayEventSource = _.default;
        var x = n(223);
        e.FuncEventSource = x.default;
        var O = n(224);
        e.JsonFeedEventSource = O.default;
        var F = n(34);
        e.EventFootprint = F.default;
        var z = n(35);
        e.Class = z.default;
        var B = n(15);
        e.Mixin = B.default;
        var A = n(58);
        e.CoordCache = A.default;
        var k = n(225);
        e.Iterator = k.default;
        var L = n(59);
        e.DragListener = L.default;
        var V = n(17);
        e.HitDragListener = V.default;
        var G = n(226);
        e.MouseFollower = G.default;
        var N = n(52);
        e.ParsableModelMixin = N.default;
        var j = n(227);
        e.Popover = j.default;
        var U = n(21);
        e.Promise = U.default;
        var W = n(228);
        e.TaskQueue = W.default;
        var q = n(229);
        e.RenderQueue = q.default;
        var Y = n(41);
        e.Scroller = Y.default;
        var Z = n(22);
        e.Theme = Z.default;
        var X = n(230);
        e.Component = X.default;
        var Q = n(231);
        e.DateComponent = Q.default;
        var $ = n(42);
        e.InteractiveDateComponent = $.default;
        var K = n(232);
        e.Calendar = K.default;
        var J = n(43);
        e.View = J.default;
        var tt = n(24);
        e.defineView = tt.defineView, e.getViewConfig = tt.getViewConfig;
        var et = n(60);
        e.DayTableMixin = et.default;
        var nt = n(61);
        e.BusinessHourRenderer = nt.default;
        var rt = n(44);
        e.EventRenderer = rt.default;
        var it = n(62);
        e.FillRenderer = it.default;
        var ot = n(63);
        e.HelperRenderer = ot.default;
        var st = n(233);
        e.ExternalDropping = st.default;
        var at = n(234);
        e.EventResizing = at.default;
        var lt = n(64);
        e.EventPointing = lt.default;
        var ut = n(235);
        e.EventDragging = ut.default;
        var dt = n(236);
        e.DateSelecting = dt.default;
        var ct = n(237);
        e.DateClicking = ct.default;
        var pt = n(14);
        e.Interaction = pt.default;
        var ht = n(65);
        e.StandardInteractionsMixin = ht.default;
        var ft = n(238);
        e.AgendaView = ft.default;
        var gt = n(239);
        e.TimeGrid = gt.default;
        var vt = n(240);
        e.TimeGridEventRenderer = vt.default;
        var yt = n(242);
        e.TimeGridFillRenderer = yt.default;
        var mt = n(241);
        e.TimeGridHelperRenderer = mt.default;
        var bt = n(66);
        e.DayGrid = bt.default;
        var wt = n(243);
        e.DayGridEventRenderer = wt.default;
        var Dt = n(245);
        e.DayGridFillRenderer = Dt.default;
        var Et = n(244);
        e.DayGridHelperRenderer = Et.default;
        var St = n(67);
        e.BasicView = St.default;
        var Ct = n(68);
        e.BasicViewDateProfileGenerator = Ct.default;
        var Rt = n(246);
        e.MonthView = Rt.default;
        var Tt = n(247);
        e.MonthViewDateProfileGenerator = Tt.default;
        var Mt = n(248);
        e.ListView = Mt.default;
        var It = n(250);
        e.ListEventPointing = It.default;
        var Ht = n(249);
        e.ListEventRenderer = Ht.default
    }, function (t, e, n) {
        function r(t, e) {
            var n, r = [];
            for (n = 0; n < t.length; n++) r.push.apply(r, t[n].buildInstances(e));
            return r
        }

        function i(t) {
            return new l.default(t.dateProfile.unzonedRange, t.def, t)
        }

        function o(t) {
            return new u.default(new d.default(t.unzonedRange, t.eventDef.isAllDay()), t.eventDef, t.eventInstance)
        }

        function s(t) {
            return t.dateProfile.unzonedRange
        }

        function a(t) {
            return t.componentFootprint
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var l = n(50),
            u = n(34),
            d = n(12);
        e.eventDefsToEventInstances = r, e.eventInstanceToEventRange = i, e.eventRangeToEventFootprint = o, e.eventInstanceToUnzonedRange = s, e.eventFootprintToComponentFootprint = a
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(5),
            i = n(19),
            o = n(50),
            s = function () {
                function t(t) {
                    this.eventInstances = t || []
                }
                return t.prototype.getAllEventRanges = function (t) {
                    return t ? this.sliceNormalRenderRanges(t) : this.eventInstances.map(i.eventInstanceToEventRange)
                }, t.prototype.sliceRenderRanges = function (t) {
                    return this.isInverse() ? this.sliceInverseRenderRanges(t) : this.sliceNormalRenderRanges(t)
                }, t.prototype.sliceNormalRenderRanges = function (t) {
                    var e, n, r, i = this.eventInstances,
                        s = [];
                    for (e = 0; e < i.length; e++) n = i[e], (r = n.dateProfile.unzonedRange.intersect(t)) && s.push(new o.default(r, n.def, n));
                    return s
                }, t.prototype.sliceInverseRenderRanges = function (t) {
                    var e = this.eventInstances.map(i.eventInstanceToUnzonedRange),
                        n = this.getEventDef();
                    return e = r.default.invertRanges(e, t), e.map(function (t) {
                        return new o.default(t, n)
                    })
                }, t.prototype.isInverse = function () {
                    return this.getEventDef().hasInverseRendering()
                }, t.prototype.getEventDef = function () {
                    return this.explicitEventDef || this.eventInstances[0].def
                }, t
            }();
        e.default = s
    }, function (t, e, n) {
        function r(t, e) {
            t.then = function (n) {
                return "function" == typeof n ? s.resolve(n(e)) : t
            }
        }

        function i(t) {
            t.then = function (e, n) {
                return "function" == typeof n && n(), t
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = n(3),
            s = {
                construct: function (t) {
                    var e = o.Deferred(),
                        n = e.promise();
                    return "function" == typeof t && t(function (t) {
                        e.resolve(t), r(n, t)
                    }, function () {
                        e.reject(), i(n)
                    }), n
                },
                resolve: function (t) {
                    var e = o.Deferred().resolve(t),
                        n = e.promise();
                    return r(n, t), n
                },
                reject: function () {
                    var t = o.Deferred().reject(),
                        e = t.promise();
                    return i(e), e
                }
            };
        e.default = s
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(3),
            i = function () {
                function t(t) {
                    this.optionsManager = t, this.processIconOverride()
                }
                return t.prototype.processIconOverride = function () {
                    this.iconOverrideOption && this.setIconOverride(this.optionsManager.get(this.iconOverrideOption))
                }, t.prototype.setIconOverride = function (t) {
                    var e, n;
                    if (r.isPlainObject(t)) {
                        e = r.extend({}, this.iconClasses);
                        for (n in t) e[n] = this.applyIconOverridePrefix(t[n]);
                        this.iconClasses = e
                    } else !1 === t && (this.iconClasses = {})
                }, t.prototype.applyIconOverridePrefix = function (t) {
                    var e = this.iconOverridePrefix;
                    return e && 0 !== t.indexOf(e) && (t = e + t), t
                }, t.prototype.getClass = function (t) {
                    return this.classes[t] || ""
                }, t.prototype.getIconClass = function (t) {
                    var e = this.iconClasses[t];
                    return e ? this.baseIconClass + " " + e : ""
                }, t.prototype.getCustomButtonIconClass = function (t) {
                    var e;
                    return this.iconOverrideCustomButtonOption && (e = t[this.iconOverrideCustomButtonOption]) ? this.baseIconClass + " " + this.applyIconOverridePrefix(e) : ""
                }, t
            }();
        e.default = i, i.prototype.classes = {}, i.prototype.iconClasses = {}, i.prototype.baseIconClass = "", i.prototype.iconOverridePrefix = ""
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(3),
            i = n(18),
            o = n(13),
            s = n(7);
        i.touchMouseIgnoreWait = 500;
        var a = null,
            l = 0,
            u = function () {
                function t() {
                    this.isTouching = !1, this.mouseIgnoreDepth = 0
                }
                return t.get = function () {
                    return a || (a = new t, a.bind()), a
                }, t.needed = function () {
                    t.get(), l++
                }, t.unneeded = function () {
                    --l || (a.unbind(), a = null)
                }, t.prototype.bind = function () {
                    var t = this;
                    this.listenTo(r(document), {
                        touchstart: this.handleTouchStart,
                        touchcancel: this.handleTouchCancel,
                        touchend: this.handleTouchEnd,
                        mousedown: this.handleMouseDown,
                        mousemove: this.handleMouseMove,
                        mouseup: this.handleMouseUp,
                        click: this.handleClick,
                        selectstart: this.handleSelectStart,
                        contextmenu: this.handleContextMenu
                    }), window.addEventListener("touchmove", this.handleTouchMoveProxy = function (e) {
                        t.handleTouchMove(r.Event(e))
                    }, {
                        passive: !1
                    }), window.addEventListener("scroll", this.handleScrollProxy = function (e) {
                        t.handleScroll(r.Event(e))
                    }, !0)
                }, t.prototype.unbind = function () {
                    this.stopListeningTo(r(document)), window.removeEventListener("touchmove", this.handleTouchMoveProxy, {
                        passive: !1
                    }), window.removeEventListener("scroll", this.handleScrollProxy, !0)
                }, t.prototype.handleTouchStart = function (t) {
                    this.stopTouch(t, !0), this.isTouching = !0, this.trigger("touchstart", t)
                }, t.prototype.handleTouchMove = function (t) {
                    this.isTouching && this.trigger("touchmove", t)
                }, t.prototype.handleTouchCancel = function (t) {
                    this.isTouching && (this.trigger("touchcancel", t), this.stopTouch(t))
                }, t.prototype.handleTouchEnd = function (t) {
                    this.stopTouch(t)
                }, t.prototype.handleMouseDown = function (t) {
                    this.shouldIgnoreMouse() || this.trigger("mousedown", t)
                }, t.prototype.handleMouseMove = function (t) {
                    this.shouldIgnoreMouse() || this.trigger("mousemove", t)
                }, t.prototype.handleMouseUp = function (t) {
                    this.shouldIgnoreMouse() || this.trigger("mouseup", t)
                }, t.prototype.handleClick = function (t) {
                    this.shouldIgnoreMouse() || this.trigger("click", t)
                }, t.prototype.handleSelectStart = function (t) {
                    this.trigger("selectstart", t)
                }, t.prototype.handleContextMenu = function (t) {
                    this.trigger("contextmenu", t)
                }, t.prototype.handleScroll = function (t) {
                    this.trigger("scroll", t)
                }, t.prototype.stopTouch = function (t, e) {
                    void 0 === e && (e = !1), this.isTouching && (this.isTouching = !1, this.trigger("touchend", t), e || this.startTouchMouseIgnore())
                }, t.prototype.startTouchMouseIgnore = function () {
                    var t = this,
                        e = i.touchMouseIgnoreWait;
                    e && (this.mouseIgnoreDepth++, setTimeout(function () {
                        t.mouseIgnoreDepth--
                    }, e))
                }, t.prototype.shouldIgnoreMouse = function () {
                    return this.isTouching || Boolean(this.mouseIgnoreDepth)
                }, t
            }();
        e.default = u, s.default.mixInto(u), o.default.mixInto(u)
    }, function (t, e, n) {
        function r(t, n) {
            e.viewHash[t] = n
        }

        function i(t) {
            return e.viewHash[t]
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = n(18);
        e.viewHash = {}, o.views = e.viewHash, e.defineView = r, e.getViewConfig = i
    }, , , , , , , , function (t, e, n) {
        function r(t) {
            a.each(f, function (e, n) {
                null == t[e] && (t[e] = n(t))
            })
        }

        function i(t, n, r) {
            var i = e.localeOptionHash[t] || (e.localeOptionHash[t] = {});
            i.isRTL = r.isRTL, i.weekNumberTitle = r.weekHeader, a.each(p, function (t, e) {
                i[t] = e(r)
            });
            var o = a.datepicker;
            o && (o.regional[n] = o.regional[t] = r, o.regional.en = o.regional[""], o.setDefaults(r))
        }

        function o(t, n) {
            var r, i;
            r = e.localeOptionHash[t] || (e.localeOptionHash[t] = {}), n && (r = e.localeOptionHash[t] = d.mergeOptions([r, n])), i = s(t), a.each(h, function (t, e) {
                null == r[t] && (r[t] = e(i, r))
            }), d.globalDefaults.locale = t
        }

        function s(t) {
            return l.localeData(t) || l.localeData("en")
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var a = n(3),
            l = n(0),
            u = n(18),
            d = n(33),
            c = n(4);
        e.localeOptionHash = {}, u.locales = e.localeOptionHash;
        var p = {
                buttonText: function (t) {
                    return {
                        prev: c.stripHtmlEntities(t.prevText),
                        next: c.stripHtmlEntities(t.nextText),
                        today: c.stripHtmlEntities(t.currentText)
                    }
                },
                monthYearFormat: function (t) {
                    return t.showMonthAfterYear ? "YYYY[" + t.yearSuffix + "] MMMM" : "MMMM YYYY[" + t.yearSuffix + "]"
                }
            },
            h = {
                dayOfMonthFormat: function (t, e) {
                    var n = t.longDateFormat("l");
                    return n = n.replace(/^Y+[^\w\s]*|[^\w\s]*Y+$/g, ""), e.isRTL ? n += " ddd" : n = "ddd " + n, n
                },
                mediumTimeFormat: function (t) {
                    return t.longDateFormat("LT").replace(/\s*a$/i, "a")
                },
                smallTimeFormat: function (t) {
                    return t.longDateFormat("LT").replace(":mm", "(:mm)").replace(/(\Wmm)$/, "($1)").replace(/\s*a$/i, "a")
                },
                extraSmallTimeFormat: function (t) {
                    return t.longDateFormat("LT").replace(":mm", "(:mm)").replace(/(\Wmm)$/, "($1)").replace(/\s*a$/i, "t")
                },
                hourFormat: function (t) {
                    return t.longDateFormat("LT").replace(":mm", "").replace(/(\Wmm)$/, "").replace(/\s*a$/i, "a")
                },
                noMeridiemTimeFormat: function (t) {
                    return t.longDateFormat("LT").replace(/\s*a$/i, "")
                }
            },
            f = {
                smallDayDateFormat: function (t) {
                    return t.isRTL ? "D dd" : "dd D"
                },
                weekFormat: function (t) {
                    return t.isRTL ? "w[ " + t.weekNumberTitle + "]" : "[" + t.weekNumberTitle + " ]w"
                },
                smallWeekFormat: function (t) {
                    return t.isRTL ? "w[" + t.weekNumberTitle + "]" : "[" + t.weekNumberTitle + "]w"
                }
            };
        e.populateInstanceComputableOptions = r, e.datepickerLocale = i, e.locale = o, e.getMomentLocaleData = s, o("en", d.englishDefaults)
    }, function (t, e, n) {
        function r(t) {
            return i.mergeProps(t, o)
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(4);
        e.globalDefaults = {
            titleRangeSeparator: " ??? ",
            monthYearFormat: "MMMM YYYY",
            defaultTimedEventDuration: "02:00:00",
            defaultAllDayEventDuration: {
                days: 1
            },
            forceEventDuration: !1,
            nextDayThreshold: "09:00:00",
            columnHeader: !0,
            defaultView: "month",
            aspectRatio: 1.35,
            header: {
                left: "title",
                center: "",
                right: "today prev,next"
            },
            weekends: !0,
            weekNumbers: !1,
            weekNumberTitle: "W",
            weekNumberCalculation: "local",
            scrollTime: "06:00:00",
            minTime: "00:00:00",
            maxTime: "24:00:00",
            showNonCurrentDates: !0,
            lazyFetching: !0,
            startParam: "start",
            endParam: "end",
            timezoneParam: "timezone",
            timezone: !1,
            locale: null,
            isRTL: !1,
            buttonText: {
                prev: "prev",
                next: "next",
                prevYear: "prev year",
                nextYear: "next year",
                year: "year",
                today: "today",
                month: "month",
                week: "week",
                day: "day"
            },
            allDayText: "all-day",
            agendaEventMinHeight: 0,
            theme: !1,
            dragOpacity: .75,
            dragRevertDuration: 500,
            dragScroll: !0,
            unselectAuto: !0,
            dropAccept: "*",
            eventOrder: "title",
            eventLimit: !1,
            eventLimitText: "more",
            eventLimitClick: "popover",
            dayPopoverFormat: "LL",
            handleWindowResize: !0,
            windowResizeDelay: 100,
            longPressDelay: 1e3
        }, e.englishDefaults = {
            dayPopoverFormat: "dddd, MMMM D"
        }, e.rtlDefaults = {
            header: {
                left: "next,prev today",
                center: "",
                right: "title"
            },
            buttonIcons: {
                prev: "right-single-arrow",
                next: "left-single-arrow",
                prevYear: "right-double-arrow",
                nextYear: "left-double-arrow"
            },
            themeButtonIcons: {
                prev: "circle-triangle-e",
                next: "circle-triangle-w",
                nextYear: "seek-prev",
                prevYear: "seek-next"
            }
        };
        var o = ["header", "footer", "buttonText", "buttonIcons", "themeButtonIcons"];
        e.mergeOptions = r
    }, function (t, e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = function () {
            function t(t, e, n) {
                this.componentFootprint = t, this.eventDef = e, n && (this.eventInstance = n)
            }
            return t.prototype.getEventLegacy = function () {
                return (this.eventInstance || this.eventDef).toLegacy()
            }, t
        }();
        e.default = n
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(4),
            o = function () {
                function t() {}
                return t.extend = function (t) {
                    var e = function (t) {
                        function e() {
                            return null !== t && t.apply(this, arguments) || this
                        }
                        return r.__extends(e, t), e
                    }(this);
                    return i.copyOwnProps(t, e.prototype), e
                }, t.mixin = function (t) {
                    i.copyOwnProps(t, this.prototype)
                }, t
            }();
        e.default = o
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(0),
            i = n(4),
            o = n(9),
            s = n(54);
        e.default = {
            parse: function (t, e) {
                return i.isTimeString(t.start) || r.isDuration(t.start) || i.isTimeString(t.end) || r.isDuration(t.end) ? s.default.parse(t, e) : o.default.parse(t, e)
            }
        }
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(3),
            i = n(52),
            o = function () {
                function t(t) {
                    this.source = t, this.className = [], this.miscProps = {}
                }
                return t.parse = function (t, e) {
                    var n = new this(e);
                    return !!n.applyProps(t) && n
                }, t.normalizeId = function (t) {
                    return String(t)
                }, t.generateId = function () {
                    return "_fc" + t.uuid++
                }, t.prototype.clone = function () {
                    var e = new this.constructor(this.source);
                    return e.id = this.id, e.rawId = this.rawId, e.uid = this.uid, t.copyVerbatimStandardProps(this, e), e.className = this.className.slice(), e.miscProps = r.extend({}, this.miscProps), e
                }, t.prototype.hasInverseRendering = function () {
                    return "inverse-background" === this.getRendering()
                }, t.prototype.hasBgRendering = function () {
                    var t = this.getRendering();
                    return "inverse-background" === t || "background" === t
                }, t.prototype.getRendering = function () {
                    return null != this.rendering ? this.rendering : this.source.rendering
                }, t.prototype.getConstraint = function () {
                    return null != this.constraint ? this.constraint : null != this.source.constraint ? this.source.constraint : this.source.calendar.opt("eventConstraint")
                }, t.prototype.getOverlap = function () {
                    return null != this.overlap ? this.overlap : null != this.source.overlap ? this.source.overlap : this.source.calendar.opt("eventOverlap")
                }, t.prototype.isStartExplicitlyEditable = function () {
                    return null != this.startEditable ? this.startEditable : this.source.startEditable
                }, t.prototype.isDurationExplicitlyEditable = function () {
                    return null != this.durationEditable ? this.durationEditable : this.source.durationEditable
                }, t.prototype.isExplicitlyEditable = function () {
                    return null != this.editable ? this.editable : this.source.editable
                }, t.prototype.toLegacy = function () {
                    var e = r.extend({}, this.miscProps);
                    return e._id = this.uid, e.source = this.source, e.className = this.className.slice(), e.allDay = this.isAllDay(), null != this.rawId && (e.id = this.rawId), t.copyVerbatimStandardProps(this, e), e
                }, t.prototype.applyManualStandardProps = function (e) {
                    return null != e.id ? this.id = t.normalizeId(this.rawId = e.id) : this.id = t.generateId(), null != e._id ? this.uid = String(e._id) : this.uid = t.generateId(), r.isArray(e.className) && (this.className = e.className), "string" == typeof e.className && (this.className = e.className.split(/\s+/)), !0
                }, t.prototype.applyMiscProps = function (t) {
                    r.extend(this.miscProps, t)
                }, t.uuid = 0, t.defineStandardProps = i.default.defineStandardProps, t.copyVerbatimStandardProps = i.default.copyVerbatimStandardProps, t
            }();
        e.default = o, i.default.mixInto(o), o.defineStandardProps({
            _id: !1,
            id: !1,
            className: !1,
            source: !1,
            title: !0,
            url: !0,
            rendering: !0,
            constraint: !0,
            overlap: !0,
            editable: !0,
            startEditable: !0,
            durationEditable: !0,
            color: !0,
            backgroundColor: !0,
            borderColor: !0,
            textColor: !0
        })
    }, function (t, e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.default = {
            sourceClasses: [],
            registerClass: function (t) {
                this.sourceClasses.unshift(t)
            },
            parse: function (t, e) {
                var n, r, i = this.sourceClasses;
                for (n = 0; n < i.length; n++)
                    if (r = i[n].parse(t, e)) return r
            }
        }
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(4),
            i = n(16),
            o = n(37),
            s = n(40),
            a = n(9),
            l = function () {
                function t() {}
                return t.createFromRawProps = function (e, n, a) {
                    var l, u, d, c, p = e.def,
                        h = {},
                        f = {},
                        g = {},
                        v = {},
                        y = null,
                        m = null;
                    for (l in n) i.default.isStandardProp(l) ? h[l] = n[l] : p.isStandardProp(l) ? f[l] = n[l] : p.miscProps[l] !== n[l] && (g[l] = n[l]);
                    return u = i.default.parse(h, p.source), u && (d = s.default.createFromDiff(e.dateProfile, u, a)), f.id !== p.id && (y = f.id), r.isArraysEqual(f.className, p.className) || (m = f.className), o.default.copyVerbatimStandardProps(f, v), c = new t, c.eventDefId = y, c.className = m, c.verbatimStandardProps = v, c.miscProps = g, d && (c.dateMutation = d), c
                }, t.prototype.mutateSingle = function (t) {
                    var e;
                    return this.dateMutation && (e = t.dateProfile, t.dateProfile = this.dateMutation.buildNewDateProfile(e, t.source.calendar)), null != this.eventDefId && (t.id = o.default.normalizeId(t.rawId = this.eventDefId)), this.className && (t.className = this.className), this.verbatimStandardProps && a.default.copyVerbatimStandardProps(this.verbatimStandardProps, t), this.miscProps && t.applyMiscProps(this.miscProps), e ? function () {
                        t.dateProfile = e
                    } : function () {}
                }, t.prototype.setDateMutation = function (t) {
                    t && !t.isEmpty() ? this.dateMutation = t : this.dateMutation = null
                }, t.prototype.isEmpty = function () {
                    return !this.dateMutation
                }, t
            }();
        e.default = l
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(4),
            i = n(16),
            o = function () {
                function t() {
                    this.clearEnd = !1, this.forceTimed = !1, this.forceAllDay = !1
                }
                return t.createFromDiff = function (e, n, i) {
                    function o(t, e) {
                        return i ? r.diffByUnit(t, e, i) : n.isAllDay() ? r.diffDay(t, e) : r.diffDayTime(t, e)
                    }
                    var s, a, l, u, d = e.end && !n.end,
                        c = e.isAllDay() && !n.isAllDay(),
                        p = !e.isAllDay() && n.isAllDay();
                    return s = o(n.start, e.start), n.end && (a = o(n.unzonedRange.getEnd(), e.unzonedRange.getEnd()), l = a.subtract(s)), u = new t, u.clearEnd = d, u.forceTimed = c, u.forceAllDay = p, u.setDateDelta(s), u.setEndDelta(l), u
                }, t.prototype.buildNewDateProfile = function (t, e) {
                    var n = t.start.clone(),
                        r = null,
                        o = !1;
                    return t.end && !this.clearEnd ? r = t.end.clone() : this.endDelta && !r && (r = e.getDefaultEventEnd(t.isAllDay(), n)), this.forceTimed ? (o = !0, n.hasTime() || n.time(0), r && !r.hasTime() && r.time(0)) : this.forceAllDay && (n.hasTime() && n.stripTime(), r && r.hasTime() && r.stripTime()), this.dateDelta && (o = !0, n.add(this.dateDelta), r && r.add(this.dateDelta)), this.endDelta && (o = !0, r.add(this.endDelta)), this.startDelta && (o = !0, n.add(this.startDelta)), o && (n = e.applyTimezone(n), r && (r = e.applyTimezone(r))), !r && e.opt("forceEventDuration") && (r = e.getDefaultEventEnd(t.isAllDay(), n)), new i.default(n, r, e)
                }, t.prototype.setDateDelta = function (t) {
                    t && t.valueOf() ? this.dateDelta = t : this.dateDelta = null
                }, t.prototype.setStartDelta = function (t) {
                    t && t.valueOf() ? this.startDelta = t : this.startDelta = null
                }, t.prototype.setEndDelta = function (t) {
                    t && t.valueOf() ? this.endDelta = t : this.endDelta = null
                }, t.prototype.isEmpty = function () {
                    return !(this.clearEnd || this.forceTimed || this.forceAllDay || this.dateDelta || this.startDelta || this.endDelta)
                }, t
            }();
        e.default = o
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(4),
            s = n(35),
            a = function (t) {
                function e(e) {
                    var n = t.call(this) || this;
                    return e = e || {}, n.overflowX = e.overflowX || e.overflow || "auto", n.overflowY = e.overflowY || e.overflow || "auto", n
                }
                return r.__extends(e, t), e.prototype.render = function () {
                    this.el = this.renderEl(), this.applyOverflow()
                }, e.prototype.renderEl = function () {
                    return this.scrollEl = i('<div class="fc-scroller"></div>')
                }, e.prototype.clear = function () {
                    this.setHeight("auto"), this.applyOverflow()
                }, e.prototype.destroy = function () {
                    this.el.remove()
                }, e.prototype.applyOverflow = function () {
                    this.scrollEl.css({
                        "overflow-x": this.overflowX,
                        "overflow-y": this.overflowY
                    })
                }, e.prototype.lockOverflow = function (t) {
                    var e = this.overflowX,
                        n = this.overflowY;
                    t = t || this.getScrollbarWidths(), "auto" === e && (e = t.top || t.bottom || this.scrollEl[0].scrollWidth - 1 > this.scrollEl[0].clientWidth ? "scroll" : "hidden"), "auto" === n && (n = t.left || t.right || this.scrollEl[0].scrollHeight - 1 > this.scrollEl[0].clientHeight ? "scroll" : "hidden"), this.scrollEl.css({
                        "overflow-x": e,
                        "overflow-y": n
                    })
                }, e.prototype.setHeight = function (t) {
                    this.scrollEl.height(t)
                }, e.prototype.getScrollTop = function () {
                    return this.scrollEl.scrollTop()
                }, e.prototype.setScrollTop = function (t) {
                    this.scrollEl.scrollTop(t)
                }, e.prototype.getClientWidth = function () {
                    return this.scrollEl[0].clientWidth
                }, e.prototype.getClientHeight = function () {
                    return this.scrollEl[0].clientHeight
                }, e.prototype.getScrollbarWidths = function () {
                    return o.getScrollbarWidths(this.scrollEl)
                }, e
            }(s.default);
        e.default = a
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(4),
            s = n(231),
            a = n(23),
            l = function (t) {
                function e(e, n) {
                    var r = t.call(this, e, n) || this;
                    return r.segSelector = ".fc-event-container > *", r.dateSelectingClass && (r.dateClicking = new r.dateClickingClass(r)), r.dateSelectingClass && (r.dateSelecting = new r.dateSelectingClass(r)), r.eventPointingClass && (r.eventPointing = new r.eventPointingClass(r)), r.eventDraggingClass && r.eventPointing && (r.eventDragging = new r.eventDraggingClass(r, r.eventPointing)), r.eventResizingClass && r.eventPointing && (r.eventResizing = new r.eventResizingClass(r, r.eventPointing)), r.externalDroppingClass && (r.externalDropping = new r.externalDroppingClass(r)), r
                }
                return r.__extends(e, t), e.prototype.setElement = function (e) {
                    t.prototype.setElement.call(this, e), this.dateClicking && this.dateClicking.bindToEl(e), this.dateSelecting && this.dateSelecting.bindToEl(e), this.bindAllSegHandlersToEl(e)
                }, e.prototype.removeElement = function () {
                    this.endInteractions(), t.prototype.removeElement.call(this)
                }, e.prototype.executeEventUnrender = function () {
                    this.endInteractions(), t.prototype.executeEventUnrender.call(this)
                }, e.prototype.bindGlobalHandlers = function () {
                    t.prototype.bindGlobalHandlers.call(this), this.externalDropping && this.externalDropping.bindToDocument()
                }, e.prototype.unbindGlobalHandlers = function () {
                    t.prototype.unbindGlobalHandlers.call(this), this.externalDropping && this.externalDropping.unbindFromDocument()
                }, e.prototype.bindDateHandlerToEl = function (t, e, n) {
                    var r = this;
                    this.el.on(e, function (t) {
                        if (!i(t.target).is(r.segSelector + ":not(.fc-helper)," + r.segSelector + ":not(.fc-helper) *,.fc-more,a[data-goto]")) return n.call(r, t)
                    })
                }, e.prototype.bindAllSegHandlersToEl = function (t) {
                    [this.eventPointing, this.eventDragging, this.eventResizing].forEach(function (e) {
                        e && e.bindToEl(t)
                    })
                }, e.prototype.bindSegHandlerToEl = function (t, e, n) {
                    var r = this;
                    t.on(e, this.segSelector, function (t) {
                        var e = i(t.currentTarget);
                        if (!e.is(".fc-helper")) {
                            var o = e.data("fc-seg");
                            if (o && !r.shouldIgnoreEventPointing()) return n.call(r, o, t)
                        }
                    })
                }, e.prototype.shouldIgnoreMouse = function () {
                    return a.default.get().shouldIgnoreMouse()
                }, e.prototype.shouldIgnoreTouch = function () {
                    var t = this._getView();
                    return t.isSelected || t.selectedEvent
                }, e.prototype.shouldIgnoreEventPointing = function () {
                    return this.eventDragging && this.eventDragging.isDragging || this.eventResizing && this.eventResizing.isResizing
                }, e.prototype.canStartSelection = function (t, e) {
                    return o.getEvIsTouch(e) && !this.canStartResize(t, e) && (this.isEventDefDraggable(t.footprint.eventDef) || this.isEventDefResizable(t.footprint.eventDef))
                }, e.prototype.canStartDrag = function (t, e) {
                    return !this.canStartResize(t, e) && this.isEventDefDraggable(t.footprint.eventDef)
                }, e.prototype.canStartResize = function (t, e) {
                    var n = this._getView(),
                        r = t.footprint.eventDef;
                    return (!o.getEvIsTouch(e) || n.isEventDefSelected(r)) && this.isEventDefResizable(r) && i(e.target).is(".fc-resizer")
                }, e.prototype.endInteractions = function () {
                    [this.dateClicking, this.dateSelecting, this.eventPointing, this.eventDragging, this.eventResizing].forEach(function (t) {
                        t && t.end()
                    })
                }, e.prototype.isEventDefDraggable = function (t) {
                    return this.isEventDefStartEditable(t)
                }, e.prototype.isEventDefStartEditable = function (t) {
                    var e = t.isStartExplicitlyEditable();
                    return null == e && null == (e = this.opt("eventStartEditable")) && (e = this.isEventDefGenerallyEditable(t)), e
                }, e.prototype.isEventDefGenerallyEditable = function (t) {
                    var e = t.isExplicitlyEditable();
                    return null == e && (e = this.opt("editable")), e
                }, e.prototype.isEventDefResizableFromStart = function (t) {
                    return this.opt("eventResizableFromStart") && this.isEventDefResizable(t)
                }, e.prototype.isEventDefResizableFromEnd = function (t) {
                    return this.isEventDefResizable(t)
                }, e.prototype.isEventDefResizable = function (t) {
                    var e = t.isDurationExplicitlyEditable();
                    return null == e && null == (e = this.opt("eventDurationEditable")) && (e = this.isEventDefGenerallyEditable(t)), e
                }, e.prototype.diffDates = function (t, e) {
                    return this.largeUnit ? o.diffByUnit(t, e, this.largeUnit) : o.diffDayTime(t, e)
                }, e.prototype.isEventInstanceGroupAllowed = function (t) {
                    var e, n = this._getView(),
                        r = this.dateProfile,
                        i = this.eventRangesToEventFootprints(t.getAllEventRanges());
                    for (e = 0; e < i.length; e++)
                        if (!r.validUnzonedRange.containsRange(i[e].componentFootprint.unzonedRange)) return !1;
                    return n.calendar.constraints.isEventInstanceGroupAllowed(t)
                }, e.prototype.isExternalInstanceGroupAllowed = function (t) {
                    var e, n = this._getView(),
                        r = this.dateProfile,
                        i = this.eventRangesToEventFootprints(t.getAllEventRanges());
                    for (e = 0; e < i.length; e++)
                        if (!r.validUnzonedRange.containsRange(i[e].componentFootprint.unzonedRange)) return !1;
                    for (e = 0; e < i.length; e++)
                        if (!n.calendar.constraints.isSelectionFootprintAllowed(i[e].componentFootprint)) return !1;
                    return !0
                }, e
            }(s.default);
        e.default = l
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(0),
            s = n(4),
            a = n(229),
            l = n(55),
            u = n(42),
            d = n(23),
            c = n(5),
            p = function (t) {
                function e(e, n) {
                    var r = t.call(this, null, n.options) || this;
                    return r.batchRenderDepth = 0, r.isSelected = !1, r.calendar = e, r.viewSpec = n, r.type = n.type, r.name = r.type, r.initRenderQueue(), r.initHiddenDays(), r.dateProfileGenerator = new r.dateProfileGeneratorClass(r), r.bindBaseRenderHandlers(), r.eventOrderSpecs = s.parseFieldSpecs(r.opt("eventOrder")), r.initialize && r.initialize(), r
                }
                return r.__extends(e, t), e.prototype._getView = function () {
                    return this
                }, e.prototype.opt = function (t) {
                    return this.options[t]
                }, e.prototype.initRenderQueue = function () {
                    this.renderQueue = new a.default({
                        event: this.opt("eventRenderWait")
                    }), this.renderQueue.on("start", this.onRenderQueueStart.bind(this)), this.renderQueue.on("stop", this.onRenderQueueStop.bind(this)), this.on("before:change", this.startBatchRender), this.on("change", this.stopBatchRender)
                }, e.prototype.onRenderQueueStart = function () {
                    this.calendar.freezeContentHeight(), this.addScroll(this.queryScroll())
                }, e.prototype.onRenderQueueStop = function () {
                    this.calendar.updateViewSize() && this.popScroll(), this.calendar.thawContentHeight()
                }, e.prototype.startBatchRender = function () {
                    this.batchRenderDepth++ || this.renderQueue.pause()
                }, e.prototype.stopBatchRender = function () {
                    --this.batchRenderDepth || this.renderQueue.resume()
                }, e.prototype.requestRender = function (t, e, n) {
                    this.renderQueue.queue(t, e, n)
                }, e.prototype.whenSizeUpdated = function (t) {
                    this.renderQueue.isRunning ? this.renderQueue.one("stop", t.bind(this)) : t.call(this)
                }, e.prototype.computeTitle = function (t) {
                    var e;
                    return e = /^(year|month)$/.test(t.currentRangeUnit) ? t.currentUnzonedRange : t.activeUnzonedRange, this.formatRange({
                        start: this.calendar.msToMoment(e.startMs, t.isRangeAllDay),
                        end: this.calendar.msToMoment(e.endMs, t.isRangeAllDay)
                    }, t.isRangeAllDay, this.opt("titleFormat") || this.computeTitleFormat(t), this.opt("titleRangeSeparator"))
                }, e.prototype.computeTitleFormat = function (t) {
                    var e = t.currentRangeUnit;
                    return "year" === e ? "YYYY" : "month" === e ? this.opt("monthYearFormat") : t.currentUnzonedRange.as("days") > 1 ? "ll" : "LL"
                }, e.prototype.setDate = function (t) {
                    var e = this.get("dateProfile"),
                        n = this.dateProfileGenerator.build(t, void 0, !0);
                    e && e.activeUnzonedRange.equals(n.activeUnzonedRange) || this.set("dateProfile", n)
                }, e.prototype.unsetDate = function () {
                    this.unset("dateProfile")
                }, e.prototype.fetchInitialEvents = function (t) {
                    var e = this.calendar,
                        n = t.isRangeAllDay && !this.usesMinMaxTime;
                    return e.requestEvents(e.msToMoment(t.activeUnzonedRange.startMs, n), e.msToMoment(t.activeUnzonedRange.endMs, n))
                }, e.prototype.bindEventChanges = function () {
                    this.listenTo(this.calendar, "eventsReset", this.resetEvents)
                }, e.prototype.unbindEventChanges = function () {
                    this.stopListeningTo(this.calendar, "eventsReset")
                }, e.prototype.setEvents = function (t) {
                    this.set("currentEvents", t), this.set("hasEvents", !0)
                }, e.prototype.unsetEvents = function () {
                    this.unset("currentEvents"), this.unset("hasEvents")
                }, e.prototype.resetEvents = function (t) {
                    this.startBatchRender(), this.unsetEvents(), this.setEvents(t), this.stopBatchRender()
                }, e.prototype.requestDateRender = function (t) {
                    var e = this;
                    this.requestRender(function () {
                        e.executeDateRender(t)
                    }, "date", "init")
                }, e.prototype.requestDateUnrender = function () {
                    var t = this;
                    this.requestRender(function () {
                        t.executeDateUnrender()
                    }, "date", "destroy")
                }, e.prototype.executeDateRender = function (e) {
                    t.prototype.executeDateRender.call(this, e), this.render && this.render(), this.trigger("datesRendered"), this.addScroll({
                        isDateInit: !0
                    }), this.startNowIndicator()
                }, e.prototype.executeDateUnrender = function () {
                    this.unselect(), this.stopNowIndicator(), this.trigger("before:datesUnrendered"), this.destroy && this.destroy(), t.prototype.executeDateUnrender.call(this)
                }, e.prototype.bindBaseRenderHandlers = function () {
                    var t = this;
                    this.on("datesRendered", function () {
                        t.whenSizeUpdated(t.triggerViewRender)
                    }), this.on("before:datesUnrendered", function () {
                        t.triggerViewDestroy()
                    })
                }, e.prototype.triggerViewRender = function () {
                    this.publiclyTrigger("viewRender", {
                        context: this,
                        args: [this, this.el]
                    })
                }, e.prototype.triggerViewDestroy = function () {
                    this.publiclyTrigger("viewDestroy", {
                        context: this,
                        args: [this, this.el]
                    })
                }, e.prototype.requestEventsRender = function (t) {
                    var e = this;
                    this.requestRender(function () {
                        e.executeEventRender(t), e.whenSizeUpdated(e.triggerAfterEventsRendered)
                    }, "event", "init")
                }, e.prototype.requestEventsUnrender = function () {
                    var t = this;
                    this.requestRender(function () {
                        t.triggerBeforeEventsDestroyed(), t.executeEventUnrender()
                    }, "event", "destroy")
                }, e.prototype.requestBusinessHoursRender = function (t) {
                    var e = this;
                    this.requestRender(function () {
                        e.renderBusinessHours(t)
                    }, "businessHours", "init")
                }, e.prototype.requestBusinessHoursUnrender = function () {
                    var t = this;
                    this.requestRender(function () {
                        t.unrenderBusinessHours()
                    }, "businessHours", "destroy")
                }, e.prototype.bindGlobalHandlers = function () {
                    t.prototype.bindGlobalHandlers.call(this), this.listenTo(d.default.get(), {
                        touchstart: this.processUnselect,
                        mousedown: this.handleDocumentMousedown
                    })
                }, e.prototype.unbindGlobalHandlers = function () {
                    t.prototype.unbindGlobalHandlers.call(this), this.stopListeningTo(d.default.get())
                }, e.prototype.startNowIndicator = function () {
                    var t, e, n, r = this;
                    this.opt("nowIndicator") && (t = this.getNowIndicatorUnit()) && (e = s.proxy(this, "updateNowIndicator"), this.initialNowDate = this.calendar.getNow(), this.initialNowQueriedMs = (new Date).valueOf(), n = this.initialNowDate.clone().startOf(t).add(1, t).valueOf() - this.initialNowDate.valueOf(), this.nowIndicatorTimeoutID = setTimeout(function () {
                        r.nowIndicatorTimeoutID = null, e(), n = +o.duration(1, t), n = Math.max(100, n), r.nowIndicatorIntervalID = setInterval(e, n)
                    }, n))
                }, e.prototype.updateNowIndicator = function () {
                    this.isDatesRendered && this.initialNowDate && (this.unrenderNowIndicator(), this.renderNowIndicator(this.initialNowDate.clone().add((new Date).valueOf() - this.initialNowQueriedMs)), this.isNowIndicatorRendered = !0)
                }, e.prototype.stopNowIndicator = function () {
                    this.isNowIndicatorRendered && (this.nowIndicatorTimeoutID && (clearTimeout(this.nowIndicatorTimeoutID), this.nowIndicatorTimeoutID = null), this.nowIndicatorIntervalID && (clearInterval(this.nowIndicatorIntervalID), this.nowIndicatorIntervalID = null), this.unrenderNowIndicator(), this.isNowIndicatorRendered = !1)
                }, e.prototype.updateSize = function (e, n, r) {
                    this.setHeight ? this.setHeight(e, n) : t.prototype.updateSize.call(this, e, n, r), this.updateNowIndicator()
                }, e.prototype.addScroll = function (t) {
                    var e = this.queuedScroll || (this.queuedScroll = {});
                    i.extend(e, t)
                }, e.prototype.popScroll = function () {
                    this.applyQueuedScroll(), this.queuedScroll = null
                }, e.prototype.applyQueuedScroll = function () {
                    this.queuedScroll && this.applyScroll(this.queuedScroll)
                }, e.prototype.queryScroll = function () {
                    var t = {};
                    return this.isDatesRendered && i.extend(t, this.queryDateScroll()), t
                }, e.prototype.applyScroll = function (t) {
                    t.isDateInit && this.isDatesRendered && i.extend(t, this.computeInitialDateScroll()), this.isDatesRendered && this.applyDateScroll(t)
                }, e.prototype.computeInitialDateScroll = function () {
                    return {}
                }, e.prototype.queryDateScroll = function () {
                    return {}
                }, e.prototype.applyDateScroll = function (t) {}, e.prototype.reportEventDrop = function (t, e, n, r) {
                    var i = this.calendar.eventManager,
                        s = i.mutateEventsWithId(t.def.id, e),
                        a = e.dateMutation;
                    a && (t.dateProfile = a.buildNewDateProfile(t.dateProfile, this.calendar)), this.triggerEventDrop(t, a && a.dateDelta || o.duration(), s, n, r)
                }, e.prototype.triggerEventDrop = function (t, e, n, r, i) {
                    this.publiclyTrigger("eventDrop", {
                        context: r[0],
                        args: [t.toLegacy(), e, n, i, {}, this]
                    })
                }, e.prototype.reportExternalDrop = function (t, e, n, r, i, o) {
                    e && this.calendar.eventManager.addEventDef(t, n), this.triggerExternalDrop(t, e, r, i, o)
                }, e.prototype.triggerExternalDrop = function (t, e, n, r, i) {
                    this.publiclyTrigger("drop", {
                        context: n[0],
                        args: [t.dateProfile.start.clone(), r, i, this]
                    }), e && this.publiclyTrigger("eventReceive", {
                        context: this,
                        args: [t.buildInstance().toLegacy(), this]
                    })
                }, e.prototype.reportEventResize = function (t, e, n, r) {
                    var i = this.calendar.eventManager,
                        o = i.mutateEventsWithId(t.def.id, e);
                    t.dateProfile = e.dateMutation.buildNewDateProfile(t.dateProfile, this.calendar);
                    var s = e.dateMutation.endDelta || e.dateMutation.startDelta;
                    this.triggerEventResize(t, s, o, n, r)
                }, e.prototype.triggerEventResize = function (t, e, n, r, i) {
                    this.publiclyTrigger("eventResize", {
                        context: r[0],
                        args: [t.toLegacy(), e, n, i, {}, this]
                    })
                }, e.prototype.select = function (t, e) {
                    this.unselect(e), this.renderSelectionFootprint(t), this.reportSelection(t, e)
                }, e.prototype.renderSelectionFootprint = function (e) {
                    this.renderSelection ? this.renderSelection(e.toLegacy(this.calendar)) : t.prototype.renderSelectionFootprint.call(this, e)
                }, e.prototype.reportSelection = function (t, e) {
                    this.isSelected = !0, this.triggerSelect(t, e)
                }, e.prototype.triggerSelect = function (t, e) {
                    var n = this.calendar.footprintToDateProfile(t);
                    this.publiclyTrigger("select", {
                        context: this,
                        args: [n.start, n.end, e, this]
                    })
                }, e.prototype.unselect = function (t) {
                    this.isSelected && (this.isSelected = !1, this.destroySelection && this.destroySelection(), this.unrenderSelection(), this.publiclyTrigger("unselect", {
                        context: this,
                        args: [t, this]
                    }))
                }, e.prototype.selectEventInstance = function (t) {
                    this.selectedEventInstance && this.selectedEventInstance === t || (this.unselectEventInstance(), this.getEventSegs().forEach(function (e) {
                        e.footprint.eventInstance === t && e.el && e.el.addClass("fc-selected")
                    }), this.selectedEventInstance = t)
                }, e.prototype.unselectEventInstance = function () {
                    this.selectedEventInstance && (this.getEventSegs().forEach(function (t) {
                        t.el && t.el.removeClass("fc-selected")
                    }), this.selectedEventInstance = null)
                }, e.prototype.isEventDefSelected = function (t) {
                    return this.selectedEventInstance && this.selectedEventInstance.def.id === t.id
                }, e.prototype.handleDocumentMousedown = function (t) {
                    s.isPrimaryMouseButton(t) && this.processUnselect(t)
                }, e.prototype.processUnselect = function (t) {
                    this.processRangeUnselect(t), this.processEventUnselect(t)
                }, e.prototype.processRangeUnselect = function (t) {
                    var e;
                    this.isSelected && this.opt("unselectAuto") && ((e = this.opt("unselectCancel")) && i(t.target).closest(e).length || this.unselect(t))
                }, e.prototype.processEventUnselect = function (t) {
                    this.selectedEventInstance && (i(t.target).closest(".fc-selected").length || this.unselectEventInstance())
                }, e.prototype.triggerBaseRendered = function () {
                    this.publiclyTrigger("viewRender", {
                        context: this,
                        args: [this, this.el]
                    })
                }, e.prototype.triggerBaseUnrendered = function () {
                    this.publiclyTrigger("viewDestroy", {
                        context: this,
                        args: [this, this.el]
                    })
                }, e.prototype.triggerDayClick = function (t, e, n) {
                    var r = this.calendar.footprintToDateProfile(t);
                    this.publiclyTrigger("dayClick", {
                        context: e,
                        args: [r.start, n, this]
                    })
                }, e.prototype.isDateInOtherMonth = function (t, e) {
                    return !1
                }, e.prototype.getUnzonedRangeOption = function (t) {
                    var e = this.opt(t);
                    if ("function" == typeof e && (e = e.apply(null, Array.prototype.slice.call(arguments, 1))), e) return this.calendar.parseUnzonedRange(e)
                }, e.prototype.initHiddenDays = function () {
                    var t, e = this.opt("hiddenDays") || [],
                        n = [],
                        r = 0;
                    for (!1 === this.opt("weekends") && e.push(0, 6), t = 0; t < 7; t++)(n[t] = -1 !== i.inArray(t, e)) || r++;
                    if (!r) throw new Error("invalid hiddenDays");
                    this.isHiddenDayHash = n
                }, e.prototype.trimHiddenDays = function (t) {
                    var e = t.getStart(),
                        n = t.getEnd();
                    return e && (e = this.skipHiddenDays(e)), n && (n = this.skipHiddenDays(n, -1, !0)), null === e || null === n || e < n ? new c.default(e, n) : null
                }, e.prototype.isHiddenDay = function (t) {
                    return o.isMoment(t) && (t = t.day()), this.isHiddenDayHash[t]
                }, e.prototype.skipHiddenDays = function (t, e, n) {
                    void 0 === e && (e = 1), void 0 === n && (n = !1);
                    for (var r = t.clone(); this.isHiddenDayHash[(r.day() + (n ? e : 0) + 7) % 7];) r.add(e, "days");
                    return r
                }, e
            }(u.default);
        e.default = p, p.prototype.usesMinMaxTime = !1, p.prototype.dateProfileGeneratorClass = l.default, p.watch("displayingDates", ["isInDom", "dateProfile"], function (t) {
            this.requestDateRender(t.dateProfile)
        }, function () {
            this.requestDateUnrender()
        }), p.watch("displayingBusinessHours", ["displayingDates", "businessHourGenerator"], function (t) {
            this.requestBusinessHoursRender(t.businessHourGenerator)
        }, function () {
            this.requestBusinessHoursUnrender()
        }), p.watch("initialEvents", ["dateProfile"], function (t) {
            return this.fetchInitialEvents(t.dateProfile)
        }), p.watch("bindingEvents", ["initialEvents"], function (t) {
            this.setEvents(t.initialEvents), this.bindEventChanges()
        }, function () {
            this.unbindEventChanges(), this.unsetEvents()
        }), p.watch("displayingEvents", ["displayingDates", "hasEvents"], function () {
            this.requestEventsRender(this.get("currentEvents"))
        }, function () {
            this.requestEventsUnrender()
        }), p.watch("title", ["dateProfile"], function (t) {
            return this.title = this.computeTitle(t.dateProfile)
        }), p.watch("legacyDateProps", ["dateProfile"], function (t) {
            var e = this.calendar,
                n = t.dateProfile;
            this.start = e.msToMoment(n.activeUnzonedRange.startMs, n.isRangeAllDay), this.end = e.msToMoment(n.activeUnzonedRange.endMs, n.isRangeAllDay), this.intervalStart = e.msToMoment(n.currentUnzonedRange.startMs, n.isRangeAllDay), this.intervalEnd = e.msToMoment(n.currentUnzonedRange.endMs, n.isRangeAllDay)
        })
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(3),
            i = n(4),
            o = function () {
                function t(t, e) {
                    this.view = t._getView(), this.component = t, this.fillRenderer = e
                }
                return t.prototype.opt = function (t) {
                    return this.view.opt(t)
                }, t.prototype.rangeUpdated = function () {
                    var t, e;
                    this.eventTimeFormat = this.opt("eventTimeFormat") || this.opt("timeFormat") || this.computeEventTimeFormat(), t = this.opt("displayEventTime"), null == t && (t = this.computeDisplayEventTime()), e = this.opt("displayEventEnd"), null == e && (e = this.computeDisplayEventEnd()), this.displayEventTime = t, this.displayEventEnd = e
                }, t.prototype.render = function (t) {
                    var e, n, r, i = this.component._getDateProfile(),
                        o = [],
                        s = [];
                    for (e in t) n = t[e], r = n.sliceRenderRanges(i.activeUnzonedRange), n.getEventDef().hasBgRendering() ? o.push.apply(o, r) : s.push.apply(s, r);
                    this.renderBgRanges(o), this.renderFgRanges(s)
                }, t.prototype.unrender = function () {
                    this.unrenderBgRanges(), this.unrenderFgRanges()
                }, t.prototype.renderFgRanges = function (t) {
                    var e = this.component.eventRangesToEventFootprints(t),
                        n = this.component.eventFootprintsToSegs(e);
                    n = this.renderFgSegEls(n), !1 !== this.renderFgSegs(n) && (this.fgSegs = n)
                }, t.prototype.unrenderFgRanges = function () {
                    this.unrenderFgSegs(this.fgSegs || []), this.fgSegs = null
                }, t.prototype.renderBgRanges = function (t) {
                    var e = this.component.eventRangesToEventFootprints(t),
                        n = this.component.eventFootprintsToSegs(e);
                    !1 !== this.renderBgSegs(n) && (this.bgSegs = n)
                }, t.prototype.unrenderBgRanges = function () {
                    this.unrenderBgSegs(), this.bgSegs = null
                }, t.prototype.getSegs = function () {
                    return (this.bgSegs || []).concat(this.fgSegs || [])
                }, t.prototype.renderFgSegs = function (t) {
                    return !1
                }, t.prototype.unrenderFgSegs = function (t) {}, t.prototype.renderBgSegs = function (t) {
                    var e = this;
                    if (!this.fillRenderer) return !1;
                    this.fillRenderer.renderSegs("bgEvent", t, {
                        getClasses: function (t) {
                            return e.getBgClasses(t.footprint.eventDef)
                        },
                        getCss: function (t) {
                            return {
                                "background-color": e.getBgColor(t.footprint.eventDef)
                            }
                        },
                        filterEl: function (t, n) {
                            return e.filterEventRenderEl(t.footprint, n)
                        }
                    })
                }, t.prototype.unrenderBgSegs = function () {
                    this.fillRenderer && this.fillRenderer.unrender("bgEvent")
                }, t.prototype.renderFgSegEls = function (t, e) {
                    var n = this;
                    void 0 === e && (e = !1);
                    var i, o = this.view.hasPublicHandlers("eventRender"),
                        s = "",
                        a = [];
                    if (t.length) {
                        for (i = 0; i < t.length; i++) this.beforeFgSegHtml(t[i]), s += this.fgSegHtml(t[i], e);
                        r(s).each(function (e, i) {
                            var s = t[e],
                                l = r(i);
                            o && (l = n.filterEventRenderEl(s.footprint, l)), l && (l.data("fc-seg", s), s.el = l, a.push(s))
                        })
                    }
                    return a
                }, t.prototype.beforeFgSegHtml = function (t) {}, t.prototype.fgSegHtml = function (t, e) {}, t.prototype.getSegClasses = function (t, e, n) {
                    var r = ["fc-event", t.isStart ? "fc-start" : "fc-not-start", t.isEnd ? "fc-end" : "fc-not-end"].concat(this.getClasses(t.footprint.eventDef));
                    return e && r.push("fc-draggable"), n && r.push("fc-resizable"), this.view.isEventDefSelected(t.footprint.eventDef) && r.push("fc-selected"), r
                }, t.prototype.filterEventRenderEl = function (t, e) {
                    var n = t.getEventLegacy(),
                        i = this.view.publiclyTrigger("eventRender", {
                            context: n,
                            args: [n, e, this.view]
                        });
                    return !1 === i ? e = null : i && !0 !== i && (e = r(i)), e
                }, t.prototype.getTimeText = function (t, e, n) {
                    return this._getTimeText(t.eventInstance.dateProfile.start, t.eventInstance.dateProfile.end, t.componentFootprint.isAllDay, e, n)
                }, t.prototype._getTimeText = function (t, e, n, r, i) {
                    return null == r && (r = this.eventTimeFormat), null == i && (i = this.displayEventEnd), this.displayEventTime && !n ? i && e ? this.view.formatRange({
                        start: t,
                        end: e
                    }, !1, r) : t.format(r) : ""
                }, t.prototype.computeEventTimeFormat = function () {
                    return this.opt("smallTimeFormat")
                }, t.prototype.computeDisplayEventTime = function () {
                    return !0
                }, t.prototype.computeDisplayEventEnd = function () {
                    return !0
                }, t.prototype.getBgClasses = function (t) {
                    var e = this.getClasses(t);
                    return e.push("fc-bgevent"), e
                }, t.prototype.getClasses = function (t) {
                    var e, n = this.getStylingObjs(t),
                        r = [];
                    for (e = 0; e < n.length; e++) r.push.apply(r, n[e].eventClassName || n[e].className || []);
                    return r
                }, t.prototype.getSkinCss = function (t) {
                    return {
                        "background-color": this.getBgColor(t),
                        "border-color": this.getBorderColor(t),
                        color: this.getTextColor(t)
                    }
                }, t.prototype.getBgColor = function (t) {
                    var e, n, r = this.getStylingObjs(t);
                    for (e = 0; e < r.length && !n; e++) n = r[e].eventBackgroundColor || r[e].eventColor || r[e].backgroundColor || r[e].color;
                    return n || (n = this.opt("eventBackgroundColor") || this.opt("eventColor")), n
                }, t.prototype.getBorderColor = function (t) {
                    var e, n, r = this.getStylingObjs(t);
                    for (e = 0; e < r.length && !n; e++) n = r[e].eventBorderColor || r[e].eventColor || r[e].borderColor || r[e].color;
                    return n || (n = this.opt("eventBorderColor") || this.opt("eventColor")), n
                }, t.prototype.getTextColor = function (t) {
                    var e, n, r = this.getStylingObjs(t);
                    for (e = 0; e < r.length && !n; e++) n = r[e].eventTextColor || r[e].textColor;
                    return n || (n = this.opt("eventTextColor")), n
                }, t.prototype.getStylingObjs = function (t) {
                    var e = this.getFallbackStylingObjs(t);
                    return e.unshift(t), e
                }, t.prototype.getFallbackStylingObjs = function (t) {
                    return [t.source]
                }, t.prototype.sortEventSegs = function (t) {
                    t.sort(i.proxy(this, "compareEventSegs"))
                }, t.prototype.compareEventSegs = function (t, e) {
                    var n = t.footprint,
                        r = e.footprint,
                        o = n.componentFootprint,
                        s = r.componentFootprint,
                        a = o.unzonedRange,
                        l = s.unzonedRange;
                    return a.startMs - l.startMs || l.endMs - l.startMs - (a.endMs - a.startMs) || s.isAllDay - o.isAllDay || i.compareByFieldSpecs(n.eventDef, r.eventDef, this.view.eventOrderSpecs, n.eventDef.miscProps, r.eventDef.miscProps)
                }, t
            }();
        e.default = o
    }, , , , , function (t, e, n) {
        function r(t) {
            return "en" !== t.locale() ? t.clone().locale("en") : t
        }

        function i(t, e) {
            return h(a(e).fakeFormatString, t)
        }

        function o(t, e, n, r, i) {
            var o;
            return t = y.default.parseZone(t), e = y.default.parseZone(e), o = t.localeData(), n = o.longDateFormat(n) || n, s(a(n), t, e, r || " - ", i)
        }

        function s(t, e, n, r, i) {
            var o, s, a, l = t.sameUnits,
                u = e.clone().stripZone(),
                d = n.clone().stripZone(),
                c = f(t.fakeFormatString, e),
                p = f(t.fakeFormatString, n),
                h = "",
                v = "",
                y = "",
                m = "",
                b = "";
            for (o = 0; o < l.length && (!l[o] || u.isSame(d, l[o])); o++) h += c[o];
            for (s = l.length - 1; s > o && (!l[s] || u.isSame(d, l[s])) && (s - 1 !== o || "." !== c[s]); s--) v = c[s] + v;
            for (a = o; a <= s; a++) y += c[a], m += p[a];
            return (y || m) && (b = i ? m + r + y : y + r + m), g(h + b + v)
        }

        function a(t) {
            return C[t] || (C[t] = l(t))
        }

        function l(t) {
            var e = u(t);
            return {
                fakeFormatString: c(e),
                sameUnits: p(e)
            }
        }

        function u(t) {
            for (var e, n = [], r = /\[([^\]]*)\]|\(([^\)]*)\)|(LTS|LT|(\w)\4*o?)|([^\w\[\(]+)/g; e = r.exec(t);) e[1] ? n.push.apply(n, d(e[1])) : e[2] ? n.push({
                maybe: u(e[2])
            }) : e[3] ? n.push({
                token: e[3]
            }) : e[5] && n.push.apply(n, d(e[5]));
            return n
        }

        function d(t) {
            return ". " === t ? [".", " "] : [t]
        }

        function c(t) {
            var e, n, r = [];
            for (e = 0; e < t.length; e++) n = t[e], "string" == typeof n ? r.push("[" + n + "]") : n.token ? n.token in E ? r.push(b + "[" + n.token + "]") : r.push(n.token) : n.maybe && r.push(w + c(n.maybe) + w);
            return r.join(m)
        }

        function p(t) {
            var e, n, r, i = [];
            for (e = 0; e < t.length; e++) n = t[e], n.token ? (r = S[n.token.charAt(0)], i.push(r ? r.unit : "second")) : n.maybe ? i.push.apply(i, p(n.maybe)) : i.push(null);
            return i
        }

        function h(t, e) {
            return g(f(t, e).join(""))
        }

        function f(t, e) {
            var n, r, i = [],
                o = y.oldMomentFormat(e, t),
                s = o.split(m);
            for (n = 0; n < s.length; n++) r = s[n], r.charAt(0) === b ? i.push(E[r.substring(1)](e)) : i.push(r);
            return i
        }

        function g(t) {
            return t.replace(D, function (t, e) {
                return e.match(/[1-9]/) ? e : ""
            })
        }

        function v(t) {
            var e, n, r, i, o = u(t);
            for (e = 0; e < o.length; e++) n = o[e], n.token && (r = S[n.token.charAt(0)]) && (!i || r.value > i.value) && (i = r);
            return i ? i.unit : null
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var y = n(11);
        y.newMomentProto.format = function () {
            return this._fullCalendar && arguments[0] ? i(this, arguments[0]) : this._ambigTime ? y.oldMomentFormat(r(this), "YYYY-MM-DD") : this._ambigZone ? y.oldMomentFormat(r(this), "YYYY-MM-DD[T]HH:mm:ss") : this._fullCalendar ? y.oldMomentFormat(r(this)) : y.oldMomentProto.format.apply(this, arguments)
        }, y.newMomentProto.toISOString = function () {
            return this._ambigTime ? y.oldMomentFormat(r(this), "YYYY-MM-DD") : this._ambigZone ? y.oldMomentFormat(r(this), "YYYY-MM-DD[T]HH:mm:ss") : this._fullCalendar ? y.oldMomentProto.toISOString.apply(r(this), arguments) : y.oldMomentProto.toISOString.apply(this, arguments)
        };
        var m = "\v",
            b = "",
            w = "",
            D = new RegExp(w + "([^" + w + "]*)" + w, "g"),
            E = {
                t: function (t) {
                    return y.oldMomentFormat(t, "a").charAt(0)
                },
                T: function (t) {
                    return y.oldMomentFormat(t, "A").charAt(0)
                }
            },
            S = {
                Y: {
                    value: 1,
                    unit: "year"
                },
                M: {
                    value: 2,
                    unit: "month"
                },
                W: {
                    value: 3,
                    unit: "week"
                },
                w: {
                    value: 3,
                    unit: "week"
                },
                D: {
                    value: 4,
                    unit: "day"
                },
                d: {
                    value: 4,
                    unit: "day"
                }
            };
        e.formatDate = i, e.formatRange = o;
        var C = {};
        e.queryMostGranularFormatUnit = v
    }, function (t, e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = function () {
            function t(t, e, n) {
                this.unzonedRange = t, this.eventDef = e, n && (this.eventInstance = n)
            }
            return t
        }();
        e.default = n
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(35),
            o = n(13),
            s = n(7),
            a = function (t) {
                function e() {
                    var e = t.call(this) || this;
                    return e._watchers = {}, e._props = {}, e.applyGlobalWatchers(), e.constructed(), e
                }
                return r.__extends(e, t), e.watch = function (t) {
                    for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                    this.prototype.hasOwnProperty("_globalWatchArgs") || (this.prototype._globalWatchArgs = Object.create(this.prototype._globalWatchArgs)), this.prototype._globalWatchArgs[t] = e
                }, e.prototype.constructed = function () {}, e.prototype.applyGlobalWatchers = function () {
                    var t, e = this._globalWatchArgs;
                    for (t in e) this.watch.apply(this, [t].concat(e[t]))
                }, e.prototype.has = function (t) {
                    return t in this._props
                }, e.prototype.get = function (t) {
                    return void 0 === t ? this._props : this._props[t]
                }, e.prototype.set = function (t, e) {
                    var n;
                    "string" == typeof t ? (n = {}, n[t] = void 0 === e ? null : e) : n = t, this.setProps(n)
                }, e.prototype.reset = function (t) {
                    var e, n = this._props,
                        r = {};
                    for (e in n) r[e] = void 0;
                    for (e in t) r[e] = t[e];
                    this.setProps(r)
                }, e.prototype.unset = function (t) {
                    var e, n, r = {};
                    for (e = "string" == typeof t ? [t] : t, n = 0; n < e.length; n++) r[e[n]] = void 0;
                    this.setProps(r)
                }, e.prototype.setProps = function (t) {
                    var e, n, r = {},
                        i = 0;
                    for (e in t) "object" != typeof (n = t[e]) && n === this._props[e] || (r[e] = n, i++);
                    if (i) {
                        this.trigger("before:batchChange", r);
                        for (e in r) n = r[e], this.trigger("before:change", e, n), this.trigger("before:change:" + e, n);
                        for (e in r) n = r[e], void 0 === n ? delete this._props[e] : this._props[e] = n, this.trigger("change:" + e, n), this.trigger("change", e, n);
                        this.trigger("batchChange", r)
                    }
                }, e.prototype.watch = function (t, e, n, r) {
                    var i = this;
                    this.unwatch(t), this._watchers[t] = this._watchDeps(e, function (e) {
                        var r = n.call(i, e);
                        r && r.then ? (i.unset(t), r.then(function (e) {
                            i.set(t, e)
                        })) : i.set(t, r)
                    }, function (e) {
                        i.unset(t), r && r.call(i, e)
                    })
                }, e.prototype.unwatch = function (t) {
                    var e = this._watchers[t];
                    e && (delete this._watchers[t], e.teardown())
                }, e.prototype._watchDeps = function (t, e, n) {
                    var r = this,
                        i = 0,
                        o = t.length,
                        s = 0,
                        a = {},
                        l = [],
                        u = !1,
                        d = function (t, e, r) {
                            1 === ++i && s === o && (u = !0, n(a), u = !1)
                        },
                        c = function (t, n, r) {
                            void 0 === n ? (r || void 0 === a[t] || s--, delete a[t]) : (r || void 0 !== a[t] || s++, a[t] = n), --i || s === o && (u || e(a))
                        },
                        p = function (t, e) {
                            r.on(t, e), l.push([t, e])
                        };
                    return t.forEach(function (t) {
                        var e = !1;
                        "?" === t.charAt(0) && (t = t.substring(1), e = !0), p("before:change:" + t, function (t) {
                            d()
                        }), p("change:" + t, function (n) {
                            c(t, n, e)
                        })
                    }), t.forEach(function (t) {
                        var e = !1;
                        "?" === t.charAt(0) && (t = t.substring(1), e = !0), r.has(t) ? (a[t] = r.get(t), s++) : e && s++
                    }), s === o && e(a), {
                        teardown: function () {
                            for (var t = 0; t < l.length; t++) r.off(l[t][0], l[t][1]);
                            l = null, s === o && n()
                        },
                        flash: function () {
                            s === o && (n(), e(a))
                        }
                    }
                }, e.prototype.flash = function (t) {
                    var e = this._watchers[t];
                    e && e.flash()
                }, e
            }(i.default);
        e.default = a, a.prototype._globalWatchArgs = {}, o.default.mixInto(a), s.default.mixInto(a)
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(4),
            o = n(15),
            s = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.defineStandardProps = function (t) {
                    var e = this.prototype;
                    e.hasOwnProperty("standardPropMap") || (e.standardPropMap = Object.create(e.standardPropMap)), i.copyOwnProps(t, e.standardPropMap)
                }, e.copyVerbatimStandardProps = function (t, e) {
                    var n, r = this.prototype.standardPropMap;
                    for (n in r) null != t[n] && !0 === r[n] && (e[n] = t[n])
                }, e.prototype.applyProps = function (t) {
                    var e, n = this.standardPropMap,
                        r = {},
                        i = {};
                    for (e in t) !0 === n[e] ? this[e] = t[e] : !1 === n[e] ? r[e] = t[e] : i[e] = t[e];
                    return this.applyMiscProps(i), this.applyManualStandardProps(r)
                }, e.prototype.applyManualStandardProps = function (t) {
                    return !0
                }, e.prototype.applyMiscProps = function (t) {}, e.prototype.isStandardProp = function (t) {
                    return t in this.standardPropMap
                }, e
            }(o.default);
        e.default = s, s.prototype.standardPropMap = {}
    }, function (t, e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = function () {
            function t(t, e) {
                this.def = t, this.dateProfile = e
            }
            return t.prototype.toLegacy = function () {
                var t = this.dateProfile,
                    e = this.def.toLegacy();
                return e.start = t.start.clone(), e.end = t.end ? t.end.clone() : null, e
            }, t
        }();
        e.default = n
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(0),
            s = n(37),
            a = n(53),
            l = n(16),
            u = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.isAllDay = function () {
                    return !this.startTime && !this.endTime
                }, e.prototype.buildInstances = function (t) {
                    for (var e, n, r, i = this.source.calendar, o = t.getStart(), s = t.getEnd(), u = []; o.isBefore(s);) this.dowHash && !this.dowHash[o.day()] || (e = i.applyTimezone(o), n = e.clone(), r = null, this.startTime ? n.time(this.startTime) : n.stripTime(), this.endTime && (r = e.clone().time(this.endTime)), u.push(new a.default(this, new l.default(n, r, i)))), o.add(1, "days");
                    return u
                }, e.prototype.setDow = function (t) {
                    this.dowHash || (this.dowHash = {});
                    for (var e = 0; e < t.length; e++) this.dowHash[t[e]] = !0
                }, e.prototype.clone = function () {
                    var e = t.prototype.clone.call(this);
                    return e.startTime && (e.startTime = o.duration(this.startTime)), e.endTime && (e.endTime = o.duration(this.endTime)), this.dowHash && (e.dowHash = i.extend({}, this.dowHash)), e
                }, e
            }(s.default);
        e.default = u, u.prototype.applyProps = function (t) {
            var e = s.default.prototype.applyProps.call(this, t);
            return t.start && (this.startTime = o.duration(t.start)), t.end && (this.endTime = o.duration(t.end)), t.dow && this.setDow(t.dow), e
        }, u.defineStandardProps({
            start: !1,
            end: !1,
            dow: !1
        })
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(0),
            i = n(4),
            o = n(5),
            s = function () {
                function t(t) {
                    this._view = t
                }
                return t.prototype.opt = function (t) {
                    return this._view.opt(t)
                }, t.prototype.trimHiddenDays = function (t) {
                    return this._view.trimHiddenDays(t)
                }, t.prototype.msToUtcMoment = function (t, e) {
                    return this._view.calendar.msToUtcMoment(t, e)
                }, t.prototype.buildPrev = function (t) {
                    var e = t.date.clone().startOf(t.currentRangeUnit).subtract(t.dateIncrement);
                    return this.build(e, -1)
                }, t.prototype.buildNext = function (t) {
                    var e = t.date.clone().startOf(t.currentRangeUnit).add(t.dateIncrement);
                    return this.build(e, 1)
                }, t.prototype.build = function (t, e, n) {
                    void 0 === n && (n = !1);
                    var i, o, s, a, l, u, d = !t.hasTime(),
                        c = null,
                        p = null;
                    return i = this.buildValidRange(), i = this.trimHiddenDays(i), n && (t = this.msToUtcMoment(i.constrainDate(t), d)), o = this.buildCurrentRangeInfo(t, e), s = /^(year|month|week|day)$/.test(o.unit), a = this.buildRenderRange(this.trimHiddenDays(o.unzonedRange), o.unit, s), a = this.trimHiddenDays(a), l = a.clone(), this.opt("showNonCurrentDates") || (l = l.intersect(o.unzonedRange)), c = r.duration(this.opt("minTime")), p = r.duration(this.opt("maxTime")), l = this.adjustActiveRange(l, c, p), l = l.intersect(i), l && (t = this.msToUtcMoment(l.constrainDate(t), d)), u = o.unzonedRange.intersectsWith(i), {
                        validUnzonedRange: i,
                        currentUnzonedRange: o.unzonedRange,
                        currentRangeUnit: o.unit,
                        isRangeAllDay: s,
                        activeUnzonedRange: l,
                        renderUnzonedRange: a,
                        minTime: c,
                        maxTime: p,
                        isValid: u,
                        date: t,
                        dateIncrement: this.buildDateIncrement(o.duration)
                    }
                }, t.prototype.buildValidRange = function () {
                    return this._view.getUnzonedRangeOption("validRange", this._view.calendar.getNow()) || new o.default
                }, t.prototype.buildCurrentRangeInfo = function (t, e) {
                    var n, r = this._view.viewSpec,
                        o = null,
                        s = null,
                        a = null;
                    return r.duration ? (o = r.duration, s = r.durationUnit, a = this.buildRangeFromDuration(t, e, o, s)) : (n = this.opt("dayCount")) ? (s = "day", a = this.buildRangeFromDayCount(t, e, n)) : (a = this.buildCustomVisibleRange(t)) ? s = i.computeGreatestUnit(a.getStart(), a.getEnd()) : (o = this.getFallbackDuration(), s = i.computeGreatestUnit(o), a = this.buildRangeFromDuration(t, e, o, s)), {
                        duration: o,
                        unit: s,
                        unzonedRange: a
                    }
                }, t.prototype.getFallbackDuration = function () {
                    return r.duration({
                        days: 1
                    })
                }, t.prototype.adjustActiveRange = function (t, e, n) {
                    var r = t.getStart(),
                        i = t.getEnd();
                    return this._view.usesMinMaxTime && (e < 0 && r.time(0).add(e), n > 864e5 && i.time(n - 864e5)), new o.default(r, i)
                }, t.prototype.buildRangeFromDuration = function (t, e, n, s) {
                    function a() {
                        d = t.clone().startOf(h), c = d.clone().add(n), p = new o.default(d, c)
                    }
                    var l, u, d, c, p, h = this.opt("dateAlignment");
                    return h || (l = this.opt("dateIncrement"), l ? (u = r.duration(l), h = u < n ? i.computeDurationGreatestUnit(u, l) : s) : h = s), n.as("days") <= 1 && this._view.isHiddenDay(d) && (d = this._view.skipHiddenDays(d, e), d.startOf("day")), a(), this.trimHiddenDays(p) || (t = this._view.skipHiddenDays(t, e), a()), p
                }, t.prototype.buildRangeFromDayCount = function (t, e, n) {
                    var r, i, s = this.opt("dateAlignment"),
                        a = 0;
                    if (s || -1 !== e) {
                        r = t.clone(), s && r.startOf(s), r.startOf("day"), r = this._view.skipHiddenDays(r), i = r.clone();
                        do {
                            i.add(1, "day"), this._view.isHiddenDay(i) || a++
                        } while (a < n)
                    } else {
                        i = t.clone().startOf("day").add(1, "day"), i = this._view.skipHiddenDays(i, -1, !0), r = i.clone();
                        do {
                            r.add(-1, "day"), this._view.isHiddenDay(r) || a++
                        } while (a < n)
                    }
                    return new o.default(r, i)
                }, t.prototype.buildCustomVisibleRange = function (t) {
                    var e = this._view.getUnzonedRangeOption("visibleRange", this._view.calendar.applyTimezone(t));
                    return !e || null != e.startMs && null != e.endMs ? e : null
                }, t.prototype.buildRenderRange = function (t, e, n) {
                    return t.clone()
                }, t.prototype.buildDateIncrement = function (t) {
                    var e, n = this.opt("dateIncrement");
                    return n ? r.duration(n) : (e = this.opt("dateAlignment")) ? r.duration(1, e) : t || r.duration({
                        days: 1
                    })
                }, t
            }();
        e.default = s
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(4),
            s = n(21),
            a = n(6),
            l = n(9),
            u = function (t) {
                function e(e) {
                    var n = t.call(this, e) || this;
                    return n.eventDefs = [], n
                }
                return r.__extends(e, t), e.parse = function (t, e) {
                    var n;
                    return i.isArray(t.events) ? n = t : i.isArray(t) && (n = {
                        events: t
                    }), !!n && a.default.parse.call(this, n, e)
                }, e.prototype.setRawEventDefs = function (t) {
                    this.rawEventDefs = t, this.eventDefs = this.parseEventDefs(t)
                }, e.prototype.fetch = function (t, e, n) {
                    var r, i = this.eventDefs;
                    if (null != this.currentTimezone && this.currentTimezone !== n)
                        for (r = 0; r < i.length; r++) i[r] instanceof l.default && i[r].rezone();
                    return this.currentTimezone = n, s.default.resolve(i)
                }, e.prototype.addEventDef = function (t) {
                    this.eventDefs.push(t)
                }, e.prototype.removeEventDefsById = function (t) {
                    return o.removeMatching(this.eventDefs, function (e) {
                        return e.id === t
                    })
                }, e.prototype.removeAllEventDefs = function () {
                    this.eventDefs = []
                }, e.prototype.getPrimitive = function () {
                    return this.rawEventDefs
                }, e.prototype.applyManualStandardProps = function (e) {
                    var n = t.prototype.applyManualStandardProps.call(this, e);
                    return this.setRawEventDefs(e.events), n
                }, e
            }(a.default);
        e.default = u, u.defineStandardProps({
            events: !1
        })
    }, function (t, e, n) {
        function r(t, e) {
            a[t] = e
        }

        function i(t) {
            return t ? !0 === t ? s.default : a[t] : o.default
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = n(221),
            s = n(222),
            a = {};
        e.defineThemeSystem = r, e.getThemeSystemClass = i
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(3),
            i = n(4),
            o = function () {
                function t(t) {
                    this.isHorizontal = !1, this.isVertical = !1, this.els = r(t.els), this.isHorizontal = t.isHorizontal, this.isVertical = t.isVertical, this.forcedOffsetParentEl = t.offsetParent ? r(t.offsetParent) : null
                }
                return t.prototype.build = function () {
                    var t = this.forcedOffsetParentEl;
                    !t && this.els.length > 0 && (t = this.els.eq(0).offsetParent()), this.origin = t ? t.offset() : null, this.boundingRect = this.queryBoundingRect(), this.isHorizontal && this.buildElHorizontals(), this.isVertical && this.buildElVerticals()
                }, t.prototype.clear = function () {
                    this.origin = null, this.boundingRect = null, this.lefts = null, this.rights = null, this.tops = null, this.bottoms = null
                }, t.prototype.ensureBuilt = function () {
                    this.origin || this.build()
                }, t.prototype.buildElHorizontals = function () {
                    var t = [],
                        e = [];
                    this.els.each(function (n, i) {
                        var o = r(i),
                            s = o.offset().left,
                            a = o.outerWidth();
                        t.push(s), e.push(s + a)
                    }), this.lefts = t, this.rights = e
                }, t.prototype.buildElVerticals = function () {
                    var t = [],
                        e = [];
                    this.els.each(function (n, i) {
                        var o = r(i),
                            s = o.offset().top,
                            a = o.outerHeight();
                        t.push(s), e.push(s + a)
                    }), this.tops = t, this.bottoms = e
                }, t.prototype.getHorizontalIndex = function (t) {
                    this.ensureBuilt();
                    var e, n = this.lefts,
                        r = this.rights,
                        i = n.length;
                    for (e = 0; e < i; e++)
                        if (t >= n[e] && t < r[e]) return e
                }, t.prototype.getVerticalIndex = function (t) {
                    this.ensureBuilt();
                    var e, n = this.tops,
                        r = this.bottoms,
                        i = n.length;
                    for (e = 0; e < i; e++)
                        if (t >= n[e] && t < r[e]) return e
                }, t.prototype.getLeftOffset = function (t) {
                    return this.ensureBuilt(), this.lefts[t]
                }, t.prototype.getLeftPosition = function (t) {
                    return this.ensureBuilt(), this.lefts[t] - this.origin.left
                }, t.prototype.getRightOffset = function (t) {
                    return this.ensureBuilt(), this.rights[t]
                }, t.prototype.getRightPosition = function (t) {
                    return this.ensureBuilt(), this.rights[t] - this.origin.left
                }, t.prototype.getWidth = function (t) {
                    return this.ensureBuilt(), this.rights[t] - this.lefts[t]
                }, t.prototype.getTopOffset = function (t) {
                    return this.ensureBuilt(), this.tops[t]
                }, t.prototype.getTopPosition = function (t) {
                    return this.ensureBuilt(), this.tops[t] - this.origin.top
                }, t.prototype.getBottomOffset = function (t) {
                    return this.ensureBuilt(), this.bottoms[t]
                }, t.prototype.getBottomPosition = function (t) {
                    return this.ensureBuilt(), this.bottoms[t] - this.origin.top
                }, t.prototype.getHeight = function (t) {
                    return this.ensureBuilt(), this.bottoms[t] - this.tops[t]
                }, t.prototype.queryBoundingRect = function () {
                    var t;
                    return this.els.length > 0 && (t = i.getScrollParent(this.els.eq(0)), !t.is(document) && !t.is("html,body")) ? i.getClientRect(t) : null
                }, t.prototype.isPointInBounds = function (t, e) {
                    return this.isLeftInBounds(t) && this.isTopInBounds(e)
                }, t.prototype.isLeftInBounds = function (t) {
                    return !this.boundingRect || t >= this.boundingRect.left && t < this.boundingRect.right
                }, t.prototype.isTopInBounds = function (t) {
                    return !this.boundingRect || t >= this.boundingRect.top && t < this.boundingRect.bottom
                }, t
            }();
        e.default = o
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(3),
            i = n(4),
            o = n(7),
            s = n(23),
            a = function () {
                function t(t) {
                    this.isInteracting = !1, this.isDistanceSurpassed = !1, this.isDelayEnded = !1, this.isDragging = !1, this.isTouch = !1, this.isGeneric = !1, this.shouldCancelTouchScroll = !0, this.scrollAlwaysKills = !1, this.isAutoScroll = !1, this.scrollSensitivity = 30, this.scrollSpeed = 200, this.scrollIntervalMs = 50, this.options = t || {}
                }
                return t.prototype.startInteraction = function (t, e) {
                    if (void 0 === e && (e = {}), "mousedown" === t.type) {
                        if (s.default.get().shouldIgnoreMouse()) return;
                        if (!i.isPrimaryMouseButton(t)) return;
                        t.preventDefault()
                    }
                    this.isInteracting || (this.delay = i.firstDefined(e.delay, this.options.delay, 0), this.minDistance = i.firstDefined(e.distance, this.options.distance, 0), this.subjectEl = this.options.subjectEl, i.preventSelection(r("body")), this.isInteracting = !0, this.isTouch = i.getEvIsTouch(t), this.isGeneric = "dragstart" === t.type, this.isDelayEnded = !1, this.isDistanceSurpassed = !1, this.originX = i.getEvX(t), this.originY = i.getEvY(t), this.scrollEl = i.getScrollParent(r(t.target)), this.bindHandlers(), this.initAutoScroll(), this.handleInteractionStart(t), this.startDelay(t), this.minDistance || this.handleDistanceSurpassed(t))
                }, t.prototype.handleInteractionStart = function (t) {
                    this.trigger("interactionStart", t)
                }, t.prototype.endInteraction = function (t, e) {
                    this.isInteracting && (this.endDrag(t), this.delayTimeoutId && (clearTimeout(this.delayTimeoutId), this.delayTimeoutId = null), this.destroyAutoScroll(), this.unbindHandlers(), this.isInteracting = !1, this.handleInteractionEnd(t, e), i.allowSelection(r("body")))
                }, t.prototype.handleInteractionEnd = function (t, e) {
                    this.trigger("interactionEnd", t, e || !1)
                }, t.prototype.bindHandlers = function () {
                    var t = s.default.get();
                    this.isGeneric ? this.listenTo(r(document), {
                        drag: this.handleMove,
                        dragstop: this.endInteraction
                    }) : this.isTouch ? this.listenTo(t, {
                        touchmove: this.handleTouchMove,
                        touchend: this.endInteraction,
                        scroll: this.handleTouchScroll
                    }) : this.listenTo(t, {
                        mousemove: this.handleMouseMove,
                        mouseup: this.endInteraction
                    }), this.listenTo(t, {
                        selectstart: i.preventDefault,
                        contextmenu: i.preventDefault
                    })
                }, t.prototype.unbindHandlers = function () {
                    this.stopListeningTo(s.default.get()), this.stopListeningTo(r(document))
                }, t.prototype.startDrag = function (t, e) {
                    this.startInteraction(t, e), this.isDragging || (this.isDragging = !0, this.handleDragStart(t))
                }, t.prototype.handleDragStart = function (t) {
                    this.trigger("dragStart", t)
                }, t.prototype.handleMove = function (t) {
                    var e = i.getEvX(t) - this.originX,
                        n = i.getEvY(t) - this.originY,
                        r = this.minDistance;
                    this.isDistanceSurpassed || e * e + n * n >= r * r && this.handleDistanceSurpassed(t), this.isDragging && this.handleDrag(e, n, t)
                }, t.prototype.handleDrag = function (t, e, n) {
                    this.trigger("drag", t, e, n), this.updateAutoScroll(n)
                }, t.prototype.endDrag = function (t) {
                    this.isDragging && (this.isDragging = !1, this.handleDragEnd(t))
                }, t.prototype.handleDragEnd = function (t) {
                    this.trigger("dragEnd", t)
                }, t.prototype.startDelay = function (t) {
                    var e = this;
                    this.delay ? this.delayTimeoutId = setTimeout(function () {
                        e.handleDelayEnd(t)
                    }, this.delay) : this.handleDelayEnd(t)
                }, t.prototype.handleDelayEnd = function (t) {
                    this.isDelayEnded = !0, this.isDistanceSurpassed && this.startDrag(t)
                }, t.prototype.handleDistanceSurpassed = function (t) {
                    this.isDistanceSurpassed = !0, this.isDelayEnded && this.startDrag(t)
                }, t.prototype.handleTouchMove = function (t) {
                    this.isDragging && this.shouldCancelTouchScroll && t.preventDefault(), this.handleMove(t)
                }, t.prototype.handleMouseMove = function (t) {
                    this.handleMove(t)
                }, t.prototype.handleTouchScroll = function (t) {
                    this.isDragging && !this.scrollAlwaysKills || this.endInteraction(t, !0)
                }, t.prototype.trigger = function (t) {
                    for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                    this.options[t] && this.options[t].apply(this, e), this["_" + t] && this["_" + t].apply(this, e)
                }, t.prototype.initAutoScroll = function () {
                    var t = this.scrollEl;
                    this.isAutoScroll = this.options.scroll && t && !t.is(window) && !t.is(document), this.isAutoScroll && this.listenTo(t, "scroll", i.debounce(this.handleDebouncedScroll, 100))
                }, t.prototype.destroyAutoScroll = function () {
                    this.endAutoScroll(), this.isAutoScroll && this.stopListeningTo(this.scrollEl, "scroll")
                }, t.prototype.computeScrollBounds = function () {
                    this.isAutoScroll && (this.scrollBounds = i.getOuterRect(this.scrollEl))
                }, t.prototype.updateAutoScroll = function (t) {
                    var e, n, r, o, s = this.scrollSensitivity,
                        a = this.scrollBounds,
                        l = 0,
                        u = 0;
                    a && (e = (s - (i.getEvY(t) - a.top)) / s, n = (s - (a.bottom - i.getEvY(t))) / s, r = (s - (i.getEvX(t) - a.left)) / s, o = (s - (a.right - i.getEvX(t))) / s, e >= 0 && e <= 1 ? l = e * this.scrollSpeed * -1 : n >= 0 && n <= 1 && (l = n * this.scrollSpeed), r >= 0 && r <= 1 ? u = r * this.scrollSpeed * -1 : o >= 0 && o <= 1 && (u = o * this.scrollSpeed)), this.setScrollVel(l, u)
                }, t.prototype.setScrollVel = function (t, e) {
                    this.scrollTopVel = t, this.scrollLeftVel = e, this.constrainScrollVel(), !this.scrollTopVel && !this.scrollLeftVel || this.scrollIntervalId || (this.scrollIntervalId = setInterval(i.proxy(this, "scrollIntervalFunc"), this.scrollIntervalMs))
                }, t.prototype.constrainScrollVel = function () {
                    var t = this.scrollEl;
                    this.scrollTopVel < 0 ? t.scrollTop() <= 0 && (this.scrollTopVel = 0) : this.scrollTopVel > 0 && t.scrollTop() + t[0].clientHeight >= t[0].scrollHeight && (this.scrollTopVel = 0), this.scrollLeftVel < 0 ? t.scrollLeft() <= 0 && (this.scrollLeftVel = 0) : this.scrollLeftVel > 0 && t.scrollLeft() + t[0].clientWidth >= t[0].scrollWidth && (this.scrollLeftVel = 0)
                }, t.prototype.scrollIntervalFunc = function () {
                    var t = this.scrollEl,
                        e = this.scrollIntervalMs / 1e3;
                    this.scrollTopVel && t.scrollTop(t.scrollTop() + this.scrollTopVel * e), this.scrollLeftVel && t.scrollLeft(t.scrollLeft() + this.scrollLeftVel * e), this.constrainScrollVel(), this.scrollTopVel || this.scrollLeftVel || this.endAutoScroll()
                }, t.prototype.endAutoScroll = function () {
                    this.scrollIntervalId && (clearInterval(this.scrollIntervalId), this.scrollIntervalId = null, this.handleScrollEnd())
                }, t.prototype.handleDebouncedScroll = function () {
                    this.scrollIntervalId || this.handleScrollEnd()
                }, t.prototype.handleScrollEnd = function () {}, t
            }();
        e.default = a, o.default.mixInto(a)
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(4),
            o = n(15),
            s = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.updateDayTable = function () {
                    for (var t, e, n, r = this, i = r.view, o = i.calendar, s = o.msToUtcMoment(r.dateProfile.renderUnzonedRange.startMs, !0), a = o.msToUtcMoment(r.dateProfile.renderUnzonedRange.endMs, !0), l = -1, u = [], d = []; s.isBefore(a);) i.isHiddenDay(s) ? u.push(l + .5) : (l++, u.push(l), d.push(s.clone())), s.add(1, "days");
                    if (this.breakOnWeeks) {
                        for (e = d[0].day(), t = 1; t < d.length && d[t].day() !== e; t++);
                        n = Math.ceil(d.length / t)
                    } else n = 1, t = d.length;
                    this.dayDates = d, this.dayIndices = u, this.daysPerRow = t, this.rowCnt = n, this.updateDayTableCols()
                }, e.prototype.updateDayTableCols = function () {
                    this.colCnt = this.computeColCnt(), this.colHeadFormat = this.opt("columnHeaderFormat") || this.opt("columnFormat") || this.computeColHeadFormat()
                }, e.prototype.computeColCnt = function () {
                    return this.daysPerRow
                }, e.prototype.getCellDate = function (t, e) {
                    return this.dayDates[this.getCellDayIndex(t, e)].clone()
                }, e.prototype.getCellRange = function (t, e) {
                    var n = this.getCellDate(t, e);
                    return {
                        start: n,
                        end: n.clone().add(1, "days")
                    }
                }, e.prototype.getCellDayIndex = function (t, e) {
                    return t * this.daysPerRow + this.getColDayIndex(e)
                }, e.prototype.getColDayIndex = function (t) {
                    return this.isRTL ? this.colCnt - 1 - t : t
                }, e.prototype.getDateDayIndex = function (t) {
                    var e = this.dayIndices,
                        n = t.diff(this.dayDates[0], "days");
                    return n < 0 ? e[0] - 1 : n >= e.length ? e[e.length - 1] + 1 : e[n]
                }, e.prototype.computeColHeadFormat = function () {
                    return this.rowCnt > 1 || this.colCnt > 10 ? "ddd" : this.colCnt > 1 ? this.opt("dayOfMonthFormat") : "dddd"
                }, e.prototype.sliceRangeByRow = function (t) {
                    var e, n, r, i, o, s = this.daysPerRow,
                        a = this.view.computeDayRange(t),
                        l = this.getDateDayIndex(a.start),
                        u = this.getDateDayIndex(a.end.clone().subtract(1, "days")),
                        d = [];
                    for (e = 0; e < this.rowCnt; e++) n = e * s, r = n + s - 1, i = Math.max(l, n), o = Math.min(u, r), i = Math.ceil(i), o = Math.floor(o), i <= o && d.push({
                        row: e,
                        firstRowDayIndex: i - n,
                        lastRowDayIndex: o - n,
                        isStart: i === l,
                        isEnd: o === u
                    });
                    return d
                }, e.prototype.sliceRangeByDay = function (t) {
                    var e, n, r, i, o, s, a = this.daysPerRow,
                        l = this.view.computeDayRange(t),
                        u = this.getDateDayIndex(l.start),
                        d = this.getDateDayIndex(l.end.clone().subtract(1, "days")),
                        c = [];
                    for (e = 0; e < this.rowCnt; e++)
                        for (n = e * a, r = n + a - 1, i = n; i <= r; i++) o = Math.max(u, i), s = Math.min(d, i), o = Math.ceil(o), s = Math.floor(s), o <= s && c.push({
                            row: e,
                            firstRowDayIndex: o - n,
                            lastRowDayIndex: s - n,
                            isStart: o === u,
                            isEnd: s === d
                        });
                    return c
                }, e.prototype.renderHeadHtml = function () {
                    var t = this.view.calendar.theme;
                    return '<div class="fc-row ' + t.getClass("headerRow") + '"><table class="' + t.getClass("tableGrid") + '"><thead>' + this.renderHeadTrHtml() + "</thead></table></div>"
                }, e.prototype.renderHeadIntroHtml = function () {
                    return this.renderIntroHtml()
                }, e.prototype.renderHeadTrHtml = function () {
                    return "<tr>" + (this.isRTL ? "" : this.renderHeadIntroHtml()) + this.renderHeadDateCellsHtml() + (this.isRTL ? this.renderHeadIntroHtml() : "") + "</tr>"
                }, e.prototype.renderHeadDateCellsHtml = function () {
                    var t, e, n = [];
                    for (t = 0; t < this.colCnt; t++) e = this.getCellDate(0, t), n.push(this.renderHeadDateCellHtml(e));
                    return n.join("")
                }, e.prototype.renderHeadDateCellHtml = function (t, e, n) {
                    var r, o = this,
                        s = o.view,
                        a = o.dateProfile.activeUnzonedRange.containsDate(t),
                        l = ["fc-day-header", s.calendar.theme.getClass("widgetHeader")];
                    return r = "function" == typeof o.opt("columnHeaderHtml") ? o.opt("columnHeaderHtml")(t) : "function" == typeof o.opt("columnHeaderText") ? i.htmlEscape(o.opt("columnHeaderText")(t)) : i.htmlEscape(t.format(o.colHeadFormat)), 1 === o.rowCnt ? l = l.concat(o.getDayClasses(t, !0)) : l.push("fc-" + i.dayIDs[t.day()]), '<th class="' + l.join(" ") + '"' + (1 === (a && o.rowCnt) ? ' data-date="' + t.format("YYYY-MM-DD") + '"' : "") + (e > 1 ? ' colspan="' + e + '"' : "") + (n ? " " + n : "") + ">" + (a ? s.buildGotoAnchorHtml({
                        date: t,
                        forceOff: o.rowCnt > 1 || 1 === o.colCnt
                    }, r) : r) + "</th>"
                }, e.prototype.renderBgTrHtml = function (t) {
                    return "<tr>" + (this.isRTL ? "" : this.renderBgIntroHtml(t)) + this.renderBgCellsHtml(t) + (this.isRTL ? this.renderBgIntroHtml(t) : "") + "</tr>"
                }, e.prototype.renderBgIntroHtml = function (t) {
                    return this.renderIntroHtml()
                }, e.prototype.renderBgCellsHtml = function (t) {
                    var e, n, r = [];
                    for (e = 0; e < this.colCnt; e++) n = this.getCellDate(t, e), r.push(this.renderBgCellHtml(n));
                    return r.join("")
                }, e.prototype.renderBgCellHtml = function (t, e) {
                    var n = this,
                        r = n.view,
                        i = n.dateProfile.activeUnzonedRange.containsDate(t),
                        o = n.getDayClasses(t);
                    return o.unshift("fc-day", r.calendar.theme.getClass("widgetContent")), '<td class="' + o.join(" ") + '"' + (i ? ' data-date="' + t.format("YYYY-MM-DD") + '"' : "") + (e ? " " + e : "") + "></td>"
                }, e.prototype.renderIntroHtml = function () {}, e.prototype.bookendCells = function (t) {
                    var e = this.renderIntroHtml();
                    e && (this.isRTL ? t.append(e) : t.prepend(e))
                }, e
            }(o.default);
        e.default = s
    }, function (t, e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = function () {
            function t(t, e) {
                this.component = t, this.fillRenderer = e
            }
            return t.prototype.render = function (t) {
                var e = this.component,
                    n = e._getDateProfile().activeUnzonedRange,
                    r = t.buildEventInstanceGroup(e.hasAllDayBusinessHours, n),
                    i = r ? e.eventRangesToEventFootprints(r.sliceRenderRanges(n)) : [];
                this.renderEventFootprints(i)
            }, t.prototype.renderEventFootprints = function (t) {
                var e = this.component.eventFootprintsToSegs(t);
                this.renderSegs(e), this.segs = e
            }, t.prototype.renderSegs = function (t) {
                this.fillRenderer && this.fillRenderer.renderSegs("businessHours", t, {
                    getClasses: function (t) {
                        return ["fc-nonbusiness", "fc-bgevent"]
                    }
                })
            }, t.prototype.unrender = function () {
                this.fillRenderer && this.fillRenderer.unrender("businessHours"), this.segs = null
            }, t.prototype.getSegs = function () {
                return this.segs || []
            }, t
        }();
        e.default = n
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(3),
            i = n(4),
            o = function () {
                function t(t) {
                    this.fillSegTag = "div", this.component = t, this.elsByFill = {}
                }
                return t.prototype.renderFootprint = function (t, e, n) {
                    this.renderSegs(t, this.component.componentFootprintToSegs(e), n)
                }, t.prototype.renderSegs = function (t, e, n) {
                    var r;
                    return e = this.buildSegEls(t, e, n), r = this.attachSegEls(t, e), r && this.reportEls(t, r), e
                }, t.prototype.unrender = function (t) {
                    var e = this.elsByFill[t];
                    e && (e.remove(), delete this.elsByFill[t])
                }, t.prototype.buildSegEls = function (t, e, n) {
                    var i, o = this,
                        s = "",
                        a = [];
                    if (e.length) {
                        for (i = 0; i < e.length; i++) s += this.buildSegHtml(t, e[i], n);
                        r(s).each(function (t, i) {
                            var s = e[t],
                                l = r(i);
                            n.filterEl && (l = n.filterEl(s, l)), l && (l = r(l), l.is(o.fillSegTag) && (s.el = l, a.push(s)))
                        })
                    }
                    return a
                }, t.prototype.buildSegHtml = function (t, e, n) {
                    var r = n.getClasses ? n.getClasses(e) : [],
                        o = i.cssToStr(n.getCss ? n.getCss(e) : {});
                    return "<" + this.fillSegTag + (r.length ? ' class="' + r.join(" ") + '"' : "") + (o ? ' style="' + o + '"' : "") + "></" + this.fillSegTag + ">"
                }, t.prototype.attachSegEls = function (t, e) {}, t.prototype.reportEls = function (t, e) {
                    this.elsByFill[t] ? this.elsByFill[t] = this.elsByFill[t].add(e) : this.elsByFill[t] = r(e)
                }, t
            }();
        e.default = o
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(9),
            i = n(34),
            o = n(6),
            s = function () {
                function t(t, e) {
                    this.view = t._getView(), this.component = t, this.eventRenderer = e
                }
                return t.prototype.renderComponentFootprint = function (t) {
                    this.renderEventFootprints([this.fabricateEventFootprint(t)])
                }, t.prototype.renderEventDraggingFootprints = function (t, e, n) {
                    this.renderEventFootprints(t, e, "fc-dragging", n ? null : this.view.opt("dragOpacity"))
                }, t.prototype.renderEventResizingFootprints = function (t, e, n) {
                    this.renderEventFootprints(t, e, "fc-resizing")
                }, t.prototype.renderEventFootprints = function (t, e, n, r) {
                    var i, o = this.component.eventFootprintsToSegs(t),
                        s = "fc-helper " + (n || "");
                    for (o = this.eventRenderer.renderFgSegEls(o), i = 0; i < o.length; i++) o[i].el.addClass(s);
                    if (null != r)
                        for (i = 0; i < o.length; i++) o[i].el.css("opacity", r);
                    this.helperEls = this.renderSegs(o, e)
                }, t.prototype.renderSegs = function (t, e) {}, t.prototype.unrender = function () {
                    this.helperEls && (this.helperEls.remove(), this.helperEls = null)
                }, t.prototype.fabricateEventFootprint = function (t) {
                    var e, n = this.view.calendar,
                        s = n.footprintToDateProfile(t),
                        a = new r.default(new o.default(n));
                    return a.dateProfile = s, e = a.buildInstance(), new i.default(t, a, e)
                }, t
            }();
        e.default = s
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(23),
            o = n(14),
            s = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.bindToEl = function (t) {
                    var e = this.component;
                    e.bindSegHandlerToEl(t, "click", this.handleClick.bind(this)), e.bindSegHandlerToEl(t, "mouseenter", this.handleMouseover.bind(this)), e.bindSegHandlerToEl(t, "mouseleave", this.handleMouseout.bind(this))
                }, e.prototype.handleClick = function (t, e) {
                    !1 === this.component.publiclyTrigger("eventClick", {
                        context: t.el[0],
                        args: [t.footprint.getEventLegacy(), e, this.view]
                    }) && e.preventDefault()
                }, e.prototype.handleMouseover = function (t, e) {
                    i.default.get().shouldIgnoreMouse() || this.mousedOverSeg || (this.mousedOverSeg = t, this.view.isEventDefResizable(t.footprint.eventDef) && t.el.addClass("fc-allow-mouse-resize"), this.component.publiclyTrigger("eventMouseover", {
                        context: t.el[0],
                        args: [t.footprint.getEventLegacy(), e, this.view]
                    }))
                }, e.prototype.handleMouseout = function (t, e) {
                    this.mousedOverSeg && (this.mousedOverSeg = null, this.view.isEventDefResizable(t.footprint.eventDef) && t.el.removeClass("fc-allow-mouse-resize"), this.component.publiclyTrigger("eventMouseout", {
                        context: t.el[0],
                        args: [t.footprint.getEventLegacy(), e || {}, this.view]
                    }))
                }, e.prototype.end = function () {
                    this.mousedOverSeg && this.handleMouseout(this.mousedOverSeg)
                }, e
            }(o.default);
        e.default = s
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(15),
            o = n(237),
            s = n(236),
            a = n(64),
            l = n(235),
            u = n(234),
            d = n(233),
            c = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e
            }(i.default);
        e.default = c, c.prototype.dateClickingClass = o.default, c.prototype.dateSelectingClass = s.default, c.prototype.eventPointingClass = a.default, c.prototype.eventDraggingClass = l.default, c.prototype.eventResizingClass = u.default, c.prototype.externalDroppingClass = d.default
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(4),
            s = n(58),
            a = n(227),
            l = n(5),
            u = n(12),
            d = n(34),
            c = n(61),
            p = n(65),
            h = n(42),
            f = n(60),
            g = n(243),
            v = n(244),
            y = n(245),
            m = function (t) {
                function e(e) {
                    var n = t.call(this, e) || this;
                    return n.cellWeekNumbersVisible = !1, n.bottomCoordPadding = 0, n.isRigid = !1, n.hasAllDayBusinessHours = !0, n
                }
                return r.__extends(e, t), e.prototype.componentFootprintToSegs = function (t) {
                    var e, n, r = this.sliceRangeByRow(t.unzonedRange);
                    for (e = 0; e < r.length; e++) n = r[e], this.isRTL ? (n.leftCol = this.daysPerRow - 1 - n.lastRowDayIndex, n.rightCol = this.daysPerRow - 1 - n.firstRowDayIndex) : (n.leftCol = n.firstRowDayIndex, n.rightCol = n.lastRowDayIndex);
                    return r
                }, e.prototype.renderDates = function (t) {
                    this.dateProfile = t, this.updateDayTable(), this.renderGrid()
                }, e.prototype.unrenderDates = function () {
                    this.removeSegPopover()
                }, e.prototype.renderGrid = function () {
                    var t, e, n = this.view,
                        r = this.rowCnt,
                        i = this.colCnt,
                        o = "";
                    for (this.headContainerEl && this.headContainerEl.html(this.renderHeadHtml()), t = 0; t < r; t++) o += this.renderDayRowHtml(t, this.isRigid);
                    for (this.el.html(o), this.rowEls = this.el.find(".fc-row"), this.cellEls = this.el.find(".fc-day, .fc-disabled-day"), this.rowCoordCache = new s.default({
                            els: this.rowEls,
                            isVertical: !0
                        }), this.colCoordCache = new s.default({
                            els: this.cellEls.slice(0, this.colCnt),
                            isHorizontal: !0
                        }), t = 0; t < r; t++)
                        for (e = 0; e < i; e++) this.publiclyTrigger("dayRender", {
                            context: n,
                            args: [this.getCellDate(t, e), this.getCellEl(t, e), n]
                        })
                }, e.prototype.renderDayRowHtml = function (t, e) {
                    var n = this.view.calendar.theme,
                        r = ["fc-row", "fc-week", n.getClass("dayRow")];
                    return e && r.push("fc-rigid"), '<div class="' + r.join(" ") + '"><div class="fc-bg"><table class="' + n.getClass("tableGrid") + '">' + this.renderBgTrHtml(t) + '</table></div><div class="fc-content-skeleton"><table>' + (this.getIsNumbersVisible() ? "<thead>" + this.renderNumberTrHtml(t) + "</thead>" : "") + "</table></div></div>"
                }, e.prototype.getIsNumbersVisible = function () {
                    return this.getIsDayNumbersVisible() || this.cellWeekNumbersVisible
                }, e.prototype.getIsDayNumbersVisible = function () {
                    return this.rowCnt > 1
                }, e.prototype.renderNumberTrHtml = function (t) {
                    return "<tr>" + (this.isRTL ? "" : this.renderNumberIntroHtml(t)) + this.renderNumberCellsHtml(t) + (this.isRTL ? this.renderNumberIntroHtml(t) : "") + "</tr>"
                }, e.prototype.renderNumberIntroHtml = function (t) {
                    return this.renderIntroHtml()
                }, e.prototype.renderNumberCellsHtml = function (t) {
                    var e, n, r = [];
                    for (e = 0; e < this.colCnt; e++) n = this.getCellDate(t, e), r.push(this.renderNumberCellHtml(n));
                    return r.join("")
                }, e.prototype.renderNumberCellHtml = function (t) {
                    var e, n, r = this.view,
                        i = "",
                        o = this.dateProfile.activeUnzonedRange.containsDate(t),
                        s = this.getIsDayNumbersVisible() && o;
                    return s || this.cellWeekNumbersVisible ? (e = this.getDayClasses(t), e.unshift("fc-day-top"), this.cellWeekNumbersVisible && (n = "ISO" === t._locale._fullCalendar_weekCalc ? 1 : t._locale.firstDayOfWeek()), i += '<td class="' + e.join(" ") + '"' + (o ? ' data-date="' + t.format() + '"' : "") + ">", this.cellWeekNumbersVisible && t.day() === n && (i += r.buildGotoAnchorHtml({
                        date: t,
                        type: "week"
                    }, {
                        class: "fc-week-number"
                    }, t.format("w"))), s && (i += r.buildGotoAnchorHtml(t, {
                        class: "fc-day-number"
                    }, t.format("D"))), i += "</td>") : "<td></td>"
                }, e.prototype.prepareHits = function () {
                    this.colCoordCache.build(), this.rowCoordCache.build(), this.rowCoordCache.bottoms[this.rowCnt - 1] += this.bottomCoordPadding
                }, e.prototype.releaseHits = function () {
                    this.colCoordCache.clear(), this.rowCoordCache.clear()
                }, e.prototype.queryHit = function (t, e) {
                    if (this.colCoordCache.isLeftInBounds(t) && this.rowCoordCache.isTopInBounds(e)) {
                        var n = this.colCoordCache.getHorizontalIndex(t),
                            r = this.rowCoordCache.getVerticalIndex(e);
                        if (null != r && null != n) return this.getCellHit(r, n)
                    }
                }, e.prototype.getHitFootprint = function (t) {
                    var e = this.getCellRange(t.row, t.col);
                    return new u.default(new l.default(e.start, e.end), !0)
                }, e.prototype.getHitEl = function (t) {
                    return this.getCellEl(t.row, t.col)
                }, e.prototype.getCellHit = function (t, e) {
                    return {
                        row: t,
                        col: e,
                        component: this,
                        left: this.colCoordCache.getLeftOffset(e),
                        right: this.colCoordCache.getRightOffset(e),
                        top: this.rowCoordCache.getTopOffset(t),
                        bottom: this.rowCoordCache.getBottomOffset(t)
                    }
                }, e.prototype.getCellEl = function (t, e) {
                    return this.cellEls.eq(t * this.colCnt + e)
                }, e.prototype.executeEventUnrender = function () {
                    this.removeSegPopover(), t.prototype.executeEventUnrender.call(this)
                }, e.prototype.getOwnEventSegs = function () {
                    return t.prototype.getOwnEventSegs.call(this).concat(this.popoverSegs || [])
                }, e.prototype.renderDrag = function (t, e, n) {
                    var r;
                    for (r = 0; r < t.length; r++) this.renderHighlight(t[r].componentFootprint);
                    if (t.length && e && e.component !== this) return this.helperRenderer.renderEventDraggingFootprints(t, e, n), !0
                }, e.prototype.unrenderDrag = function () {
                    this.unrenderHighlight(), this.helperRenderer.unrender()
                }, e.prototype.renderEventResize = function (t, e, n) {
                    var r;
                    for (r = 0; r < t.length; r++) this.renderHighlight(t[r].componentFootprint);
                    this.helperRenderer.renderEventResizingFootprints(t, e, n)
                }, e.prototype.unrenderEventResize = function () {
                    this.unrenderHighlight(), this.helperRenderer.unrender()
                }, e.prototype.removeSegPopover = function () {
                    this.segPopover && this.segPopover.hide()
                }, e.prototype.limitRows = function (t) {
                    var e, n, r = this.eventRenderer.rowStructs || [];
                    for (e = 0; e < r.length; e++) this.unlimitRow(e), !1 !== (n = !!t && ("number" == typeof t ? t : this.computeRowLevelLimit(e))) && this.limitRow(e, n)
                }, e.prototype.computeRowLevelLimit = function (t) {
                    function e(t, e) {
                        o = Math.max(o, i(e).outerHeight())
                    }
                    var n, r, o, s = this.rowEls.eq(t),
                        a = s.height(),
                        l = this.eventRenderer.rowStructs[t].tbodyEl.children();
                    for (n = 0; n < l.length; n++)
                        if (r = l.eq(n).removeClass("fc-limited"), o = 0, r.find("> td > :first-child").each(e), r.position().top + o > a) return n;
                    return !1
                }, e.prototype.limitRow = function (t, e) {
                    var n, r, o, s, a, l, u, d, c, p, h, f, g, v, y, m = this,
                        b = this.eventRenderer.rowStructs[t],
                        w = [],
                        D = 0,
                        E = function (n) {
                            for (; D < n;) l = m.getCellSegs(t, D, e), l.length && (c = r[e - 1][D], y = m.renderMoreLink(t, D, l), v = i("<div>").append(y), c.append(v), w.push(v[0])), D++
                        };
                    if (e && e < b.segLevels.length) {
                        for (n = b.segLevels[e - 1], r = b.cellMatrix, o = b.tbodyEl.children().slice(e).addClass("fc-limited").get(), s = 0; s < n.length; s++) {
                            for (a = n[s], E(a.leftCol), d = [], u = 0; D <= a.rightCol;) l = this.getCellSegs(t, D, e), d.push(l), u += l.length, D++;
                            if (u) {
                                for (c = r[e - 1][a.leftCol], p = c.attr("rowspan") || 1, h = [], f = 0; f < d.length; f++) g = i('<td class="fc-more-cell">').attr("rowspan", p), l = d[f], y = this.renderMoreLink(t, a.leftCol + f, [a].concat(l)), v = i("<div>").append(y), g.append(v), h.push(g[0]), w.push(g[0]);
                                c.addClass("fc-limited").after(i(h)), o.push(c[0])
                            }
                        }
                        E(this.colCnt), b.moreEls = i(w), b.limitedEls = i(o)
                    }
                }, e.prototype.unlimitRow = function (t) {
                    var e = this.eventRenderer.rowStructs[t];
                    e.moreEls && (e.moreEls.remove(), e.moreEls = null), e.limitedEls && (e.limitedEls.removeClass("fc-limited"), e.limitedEls = null)
                }, e.prototype.renderMoreLink = function (t, e, n) {
                    var r = this,
                        o = this.view;
                    return i('<a class="fc-more">').text(this.getMoreLinkText(n.length)).on("click", function (s) {
                        var a = r.opt("eventLimitClick"),
                            l = r.getCellDate(t, e),
                            u = i(s.currentTarget),
                            d = r.getCellEl(t, e),
                            c = r.getCellSegs(t, e),
                            p = r.resliceDaySegs(c, l),
                            h = r.resliceDaySegs(n, l);
                        "function" == typeof a && (a = r.publiclyTrigger("eventLimitClick", {
                            context: o,
                            args: [{
                                date: l.clone(),
                                dayEl: d,
                                moreEl: u,
                                segs: p,
                                hiddenSegs: h
                            }, s, o]
                        })), "popover" === a ? r.showSegPopover(t, e, u, p) : "string" == typeof a && o.calendar.zoomTo(l, a)
                    })
                }, e.prototype.showSegPopover = function (t, e, n, r) {
                    var i, o, s = this,
                        l = this.view,
                        u = n.parent();
                    i = 1 === this.rowCnt ? l.el : this.rowEls.eq(t), o = {
                        className: "fc-more-popover " + l.calendar.theme.getClass("popover"),
                        content: this.renderSegPopoverContent(t, e, r),
                        parentEl: l.el,
                        top: i.offset().top,
                        autoHide: !0,
                        viewportConstrain: this.opt("popoverViewportConstrain"),
                        hide: function () {
                            s.popoverSegs && s.triggerBeforeEventSegsDestroyed(s.popoverSegs), s.segPopover.removeElement(), s.segPopover = null, s.popoverSegs = null
                        }
                    }, this.isRTL ? o.right = u.offset().left + u.outerWidth() + 1 : o.left = u.offset().left - 1, this.segPopover = new a.default(o), this.segPopover.show(), this.bindAllSegHandlersToEl(this.segPopover.el), this.triggerAfterEventSegsRendered(r)
                }, e.prototype.renderSegPopoverContent = function (t, e, n) {
                    var r, s = this.view,
                        a = s.calendar.theme,
                        l = this.getCellDate(t, e).format(this.opt("dayPopoverFormat")),
                        u = i('<div class="fc-header ' + a.getClass("popoverHeader") + '"><span class="fc-close ' + a.getIconClass("close") + '"></span><span class="fc-title">' + o.htmlEscape(l) + '</span><div class="fc-clear"></div></div><div class="fc-body ' + a.getClass("popoverContent") + '"><div class="fc-event-container"></div></div>'),
                        d = u.find(".fc-event-container");
                    for (n = this.eventRenderer.renderFgSegEls(n, !0), this.popoverSegs = n, r = 0; r < n.length; r++) this.hitsNeeded(), n[r].hit = this.getCellHit(t, e), this.hitsNotNeeded(), d.append(n[r].el);
                    return u
                }, e.prototype.resliceDaySegs = function (t, e) {
                    var n, r, o, s = e.clone(),
                        a = s.clone().add(1, "days"),
                        c = new l.default(s, a),
                        p = [];
                    for (n = 0; n < t.length; n++) r = t[n], (o = r.footprint.componentFootprint.unzonedRange.intersect(c)) && p.push(i.extend({}, r, {
                        footprint: new d.default(new u.default(o, r.footprint.componentFootprint.isAllDay), r.footprint.eventDef, r.footprint.eventInstance),
                        isStart: r.isStart && o.isStart,
                        isEnd: r.isEnd && o.isEnd
                    }));
                    return this.eventRenderer.sortEventSegs(p), p
                }, e.prototype.getMoreLinkText = function (t) {
                    var e = this.opt("eventLimitText");
                    return "function" == typeof e ? e(t) : "+" + t + " " + e
                }, e.prototype.getCellSegs = function (t, e, n) {
                    for (var r, i = this.eventRenderer.rowStructs[t].segMatrix, o = n || 0, s = []; o < i.length;) r = i[o][e], r && s.push(r), o++;
                    return s
                }, e
            }(h.default);
        e.default = m, m.prototype.eventRendererClass = g.default, m.prototype.businessHourRendererClass = c.default, m.prototype.helperRendererClass = v.default, m.prototype.fillRendererClass = y.default, p.default.mixInto(m), f.default.mixInto(m)
    }, function (t, e, n) {
        function r(t) {
            return function (t) {
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    return e.colWeekNumbersVisible = !1, e
                }
                return i.__extends(e, t), e.prototype.renderHeadIntroHtml = function () {
                    var t = this.view;
                    return this.colWeekNumbersVisible ? '<th class="fc-week-number ' + t.calendar.theme.getClass("widgetHeader") + '" ' + t.weekNumberStyleAttr() + "><span>" + s.htmlEscape(this.opt("weekNumberTitle")) + "</span></th>" : ""
                }, e.prototype.renderNumberIntroHtml = function (t) {
                    var e = this.view,
                        n = this.getCellDate(t, 0);
                    return this.colWeekNumbersVisible ? '<td class="fc-week-number" ' + e.weekNumberStyleAttr() + ">" + e.buildGotoAnchorHtml({
                        date: n,
                        type: "week",
                        forceOff: 1 === this.colCnt
                    }, n.format("w")) + "</td>" : ""
                }, e.prototype.renderBgIntroHtml = function () {
                    var t = this.view;
                    return this.colWeekNumbersVisible ? '<td class="fc-week-number ' + t.calendar.theme.getClass("widgetContent") + '" ' + t.weekNumberStyleAttr() + "></td>" : ""
                }, e.prototype.renderIntroHtml = function () {
                    var t = this.view;
                    return this.colWeekNumbersVisible ? '<td class="fc-week-number" ' + t.weekNumberStyleAttr() + "></td>" : ""
                }, e.prototype.getIsNumbersVisible = function () {
                    return d.default.prototype.getIsNumbersVisible.apply(this, arguments) || this.colWeekNumbersVisible
                }, e
            }(t)
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(2),
            o = n(3),
            s = n(4),
            a = n(41),
            l = n(43),
            u = n(68),
            d = n(66),
            c = function (t) {
                function e(e, n) {
                    var r = t.call(this, e, n) || this;
                    return r.dayGrid = r.instantiateDayGrid(), r.dayGrid.isRigid = r.hasRigidRows(), r.opt("weekNumbers") && (r.opt("weekNumbersWithinDays") ? (r.dayGrid.cellWeekNumbersVisible = !0, r.dayGrid.colWeekNumbersVisible = !1) : (r.dayGrid.cellWeekNumbersVisible = !1, r.dayGrid.colWeekNumbersVisible = !0)), r.addChild(r.dayGrid), r.scroller = new a.default({
                        overflowX: "hidden",
                        overflowY: "auto"
                    }), r
                }
                return i.__extends(e, t), e.prototype.instantiateDayGrid = function () {
                    return new(r(this.dayGridClass))(this)
                }, e.prototype.executeDateRender = function (e) {
                    this.dayGrid.breakOnWeeks = /year|month|week/.test(e.currentRangeUnit), t.prototype.executeDateRender.call(this, e)
                }, e.prototype.renderSkeleton = function () {
                    var t, e;
                    this.el.addClass("fc-basic-view").html(this.renderSkeletonHtml()), this.scroller.render(), t = this.scroller.el.addClass("fc-day-grid-container"), e = o('<div class="fc-day-grid">').appendTo(t), this.el.find(".fc-body > tr > td").append(t), this.dayGrid.headContainerEl = this.el.find(".fc-head-container"), this.dayGrid.setElement(e)
                }, e.prototype.unrenderSkeleton = function () {
                    this.dayGrid.removeElement(), this.scroller.destroy()
                }, e.prototype.renderSkeletonHtml = function () {
                    var t = this.calendar.theme;
                    return '<table class="' + t.getClass("tableGrid") + '">' + (this.opt("columnHeader") ? '<thead class="fc-head"><tr><td class="fc-head-container ' + t.getClass("widgetHeader") + '">&nbsp;</td></tr></thead>' : "") + '<tbody class="fc-body"><tr><td class="' + t.getClass("widgetContent") + '"></td></tr></tbody></table>'
                }, e.prototype.weekNumberStyleAttr = function () {
                    return null != this.weekNumberWidth ? 'style="width:' + this.weekNumberWidth + 'px"' : ""
                }, e.prototype.hasRigidRows = function () {
                    var t = this.opt("eventLimit");
                    return t && "number" != typeof t
                }, e.prototype.updateSize = function (e, n, r) {
                    var i, o, a = this.opt("eventLimit"),
                        l = this.dayGrid.headContainerEl.find(".fc-row");
                    if (!this.dayGrid.rowEls) return void(n || (i = this.computeScrollerHeight(e), this.scroller.setHeight(i)));
                    t.prototype.updateSize.call(this, e, n, r), this.dayGrid.colWeekNumbersVisible && (this.weekNumberWidth = s.matchCellWidths(this.el.find(".fc-week-number"))), this.scroller.clear(), s.uncompensateScroll(l), this.dayGrid.removeSegPopover(), a && "number" == typeof a && this.dayGrid.limitRows(a), i = this.computeScrollerHeight(e), this.setGridHeight(i, n), a && "number" != typeof a && this.dayGrid.limitRows(a), n || (this.scroller.setHeight(i), o = this.scroller.getScrollbarWidths(), (o.left || o.right) && (s.compensateScroll(l, o), i = this.computeScrollerHeight(e), this.scroller.setHeight(i)), this.scroller.lockOverflow(o))
                }, e.prototype.computeScrollerHeight = function (t) {
                    return t - s.subtractInnerElHeight(this.el, this.scroller.el)
                }, e.prototype.setGridHeight = function (t, e) {
                    e ? s.undistributeHeight(this.dayGrid.rowEls) : s.distributeHeight(this.dayGrid.rowEls, t, !0)
                }, e.prototype.computeInitialDateScroll = function () {
                    return {
                        top: 0
                    }
                }, e.prototype.queryDateScroll = function () {
                    return {
                        top: this.scroller.getScrollTop()
                    }
                }, e.prototype.applyDateScroll = function (t) {
                    void 0 !== t.top && this.scroller.setScrollTop(t.top)
                }, e
            }(l.default);
        e.default = c, c.prototype.dateProfileGeneratorClass = u.default, c.prototype.dayGridClass = d.default
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(5),
            o = n(55),
            s = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.buildRenderRange = function (e, n, r) {
                    var o = t.prototype.buildRenderRange.call(this, e, n, r),
                        s = this.msToUtcMoment(o.startMs, r),
                        a = this.msToUtcMoment(o.endMs, r);
                    return /^(year|month)$/.test(n) && (s.startOf("week"), a.weekday() && a.add(1, "week").startOf("week")), new i.default(s, a)
                }, e
            }(o.default);
        e.default = s
    }, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function (t, e, n) {
        function r(t, e, n) {
            var r;
            for (r = 0; r < t.length; r++)
                if (!e(t[r].eventInstance.toLegacy(), n ? n.toLegacy() : null)) return !1;
            return !0
        }

        function i(t, e) {
            var n, r, i, o, s = e.toLegacy();
            for (n = 0; n < t.length; n++) {
                if (r = t[n].eventInstance, i = r.def, !1 === (o = i.getOverlap())) return !1;
                if ("function" == typeof o && !o(r.toLegacy(), s)) return !1
            }
            return !0
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = n(5),
            s = n(12),
            a = n(36),
            l = n(6),
            u = n(19),
            d = function () {
                function t(t, e) {
                    this.eventManager = t, this._calendar = e
                }
                return t.prototype.opt = function (t) {
                    return this._calendar.opt(t)
                }, t.prototype.isEventInstanceGroupAllowed = function (t) {
                    var e, n = t.getEventDef(),
                        r = this.eventRangesToEventFootprints(t.getAllEventRanges()),
                        i = this.getPeerEventInstances(n),
                        o = i.map(u.eventInstanceToEventRange),
                        s = this.eventRangesToEventFootprints(o),
                        a = n.getConstraint(),
                        l = n.getOverlap(),
                        d = this.opt("eventAllow");
                    for (e = 0; e < r.length; e++)
                        if (!this.isFootprintAllowed(r[e].componentFootprint, s, a, l, r[e].eventInstance)) return !1;
                    if (d)
                        for (e = 0; e < r.length; e++)
                            if (!1 === d(r[e].componentFootprint.toLegacy(this._calendar), r[e].getEventLegacy())) return !1;
                    return !0
                }, t.prototype.getPeerEventInstances = function (t) {
                    return this.eventManager.getEventInstancesWithoutId(t.id)
                }, t.prototype.isSelectionFootprintAllowed = function (t) {
                    var e, n = this.eventManager.getEventInstances(),
                        r = n.map(u.eventInstanceToEventRange),
                        i = this.eventRangesToEventFootprints(r);
                    return !!this.isFootprintAllowed(t, i, this.opt("selectConstraint"), this.opt("selectOverlap")) && (!(e = this.opt("selectAllow")) || !1 !== e(t.toLegacy(this._calendar)))
                }, t.prototype.isFootprintAllowed = function (t, e, n, o, s) {
                    var a, l;
                    if (null != n && (a = this.constraintValToFootprints(n, t.isAllDay), !this.isFootprintWithinConstraints(t, a))) return !1;
                    if (l = this.collectOverlapEventFootprints(e, t), !1 === o) {
                        if (l.length) return !1
                    } else if ("function" == typeof o && !r(l, o, s)) return !1;
                    return !(s && !i(l, s))
                }, t.prototype.isFootprintWithinConstraints = function (t, e) {
                    var n;
                    for (n = 0; n < e.length; n++)
                        if (this.footprintContainsFootprint(e[n], t)) return !0;
                    return !1
                }, t.prototype.constraintValToFootprints = function (t, e) {
                    var n;
                    return "businessHours" === t ? this.buildCurrentBusinessFootprints(e) : "object" == typeof t ? (n = this.parseEventDefToInstances(t), n ? this.eventInstancesToFootprints(n) : this.parseFootprints(t)) : null != t ? (n = this.eventManager.getEventInstancesWithId(t), this.eventInstancesToFootprints(n)) : void 0
                }, t.prototype.buildCurrentBusinessFootprints = function (t) {
                    var e = this._calendar.view,
                        n = e.get("businessHourGenerator"),
                        r = e.dateProfile.activeUnzonedRange,
                        i = n.buildEventInstanceGroup(t, r);
                    return i ? this.eventInstancesToFootprints(i.eventInstances) : []
                }, t.prototype.eventInstancesToFootprints = function (t) {
                    var e = t.map(u.eventInstanceToEventRange);
                    return this.eventRangesToEventFootprints(e).map(u.eventFootprintToComponentFootprint)
                }, t.prototype.collectOverlapEventFootprints = function (t, e) {
                    var n, r = [];
                    for (n = 0; n < t.length; n++) this.footprintsIntersect(e, t[n].componentFootprint) && r.push(t[n]);
                    return r
                }, t.prototype.parseEventDefToInstances = function (t) {
                    var e = this.eventManager,
                        n = a.default.parse(t, new l.default(this._calendar));
                    return !!n && n.buildInstances(e.currentPeriod.unzonedRange)
                }, t.prototype.eventRangesToEventFootprints = function (t) {
                    var e, n = [];
                    for (e = 0; e < t.length; e++) n.push.apply(n, this.eventRangeToEventFootprints(t[e]));
                    return n
                }, t.prototype.eventRangeToEventFootprints = function (t) {
                    return [u.eventRangeToEventFootprint(t)]
                }, t.prototype.parseFootprints = function (t) {
                    var e, n;
                    return t.start && (e = this._calendar.moment(t.start), e.isValid() || (e = null)), t.end && (n = this._calendar.moment(t.end), n.isValid() || (n = null)), [new s.default(new o.default(e, n), e && !e.hasTime() || n && !n.hasTime())]
                }, t.prototype.footprintContainsFootprint = function (t, e) {
                    return t.unzonedRange.containsRange(e.unzonedRange)
                }, t.prototype.footprintsIntersect = function (t, e) {
                    return t.unzonedRange.intersectsWith(e.unzonedRange)
                }, t
            }();
        e.default = d
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(3),
            i = n(19),
            o = n(20),
            s = n(54),
            a = n(6),
            l = {
                start: "09:00",
                end: "17:00",
                dow: [1, 2, 3, 4, 5],
                rendering: "inverse-background"
            },
            u = function () {
                function t(t, e) {
                    this.rawComplexDef = t, this.calendar = e
                }
                return t.prototype.buildEventInstanceGroup = function (t, e) {
                    var n, r = this.buildEventDefs(t);
                    if (r.length) return n = new o.default(i.eventDefsToEventInstances(r, e)), n.explicitEventDef = r[0], n
                }, t.prototype.buildEventDefs = function (t) {
                    var e, n = this.rawComplexDef,
                        i = [],
                        o = !1,
                        s = [];
                    for (!0 === n ? i = [{}] : r.isPlainObject(n) ? i = [n] : r.isArray(n) && (i = n, o = !0), e = 0; e < i.length; e++) o && !i[e].dow || s.push(this.buildEventDef(t, i[e]));
                    return s
                }, t.prototype.buildEventDef = function (t, e) {
                    var n = r.extend({}, l, e);
                    return t && (n.start = null, n.end = null), s.default.parse(n, new a.default(this.calendar))
                }, t
            }();
        e.default = u
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(3),
            i = n(4),
            o = n(21),
            s = n(13),
            a = n(5),
            l = n(20),
            u = function () {
                function t(t, e, n) {
                    this.pendingCnt = 0, this.freezeDepth = 0, this.stuntedReleaseCnt = 0, this.releaseCnt = 0, this.start = t, this.end = e, this.timezone = n, this.unzonedRange = new a.default(t.clone().stripZone(), e.clone().stripZone()), this.requestsByUid = {}, this.eventDefsByUid = {}, this.eventDefsById = {}, this.eventInstanceGroupsById = {}
                }
                return t.prototype.isWithinRange = function (t, e) {
                    return !t.isBefore(this.start) && !e.isAfter(this.end)
                }, t.prototype.requestSources = function (t) {
                    this.freeze();
                    for (var e = 0; e < t.length; e++) this.requestSource(t[e]);
                    this.thaw()
                }, t.prototype.requestSource = function (t) {
                    var e = this,
                        n = {
                            source: t,
                            status: "pending",
                            eventDefs: null
                        };
                    this.requestsByUid[t.uid] = n, this.pendingCnt += 1, t.fetch(this.start, this.end, this.timezone).then(function (t) {
                        "cancelled" !== n.status && (n.status = "completed", n.eventDefs = t, e.addEventDefs(t), e.pendingCnt--, e.tryRelease())
                    }, function () {
                        "cancelled" !== n.status && (n.status = "failed", e.pendingCnt--, e.tryRelease())
                    })
                }, t.prototype.purgeSource = function (t) {
                    var e = this.requestsByUid[t.uid];
                    e && (delete this.requestsByUid[t.uid], "pending" === e.status ? (e.status = "cancelled", this.pendingCnt--, this.tryRelease()) : "completed" === e.status && e.eventDefs.forEach(this.removeEventDef.bind(this)))
                }, t.prototype.purgeAllSources = function () {
                    var t, e, n = this.requestsByUid,
                        r = 0;
                    for (t in n) e = n[t], "pending" === e.status ? e.status = "cancelled" : "completed" === e.status && r++;
                    this.requestsByUid = {}, this.pendingCnt = 0, r && this.removeAllEventDefs()
                }, t.prototype.getEventDefByUid = function (t) {
                    return this.eventDefsByUid[t]
                }, t.prototype.getEventDefsById = function (t) {
                    var e = this.eventDefsById[t];
                    return e ? e.slice() : []
                }, t.prototype.addEventDefs = function (t) {
                    for (var e = 0; e < t.length; e++) this.addEventDef(t[e])
                }, t.prototype.addEventDef = function (t) {
                    var e, n = this.eventDefsById,
                        r = t.id,
                        i = n[r] || (n[r] = []),
                        o = t.buildInstances(this.unzonedRange);
                    for (i.push(t), this.eventDefsByUid[t.uid] = t, e = 0; e < o.length; e++) this.addEventInstance(o[e], r)
                }, t.prototype.removeEventDefsById = function (t) {
                    var e = this;
                    this.getEventDefsById(t).forEach(function (t) {
                        e.removeEventDef(t)
                    })
                }, t.prototype.removeAllEventDefs = function () {
                    var t = r.isEmptyObject(this.eventDefsByUid);
                    this.eventDefsByUid = {}, this.eventDefsById = {}, this.eventInstanceGroupsById = {}, t || this.tryRelease()
                }, t.prototype.removeEventDef = function (t) {
                    var e = this.eventDefsById,
                        n = e[t.id];
                    delete this.eventDefsByUid[t.uid], n && (i.removeExact(n, t), n.length || delete e[t.id], this.removeEventInstancesForDef(t))
                }, t.prototype.getEventInstances = function () {
                    var t, e = this.eventInstanceGroupsById,
                        n = [];
                    for (t in e) n.push.apply(n, e[t].eventInstances);
                    return n
                }, t.prototype.getEventInstancesWithId = function (t) {
                    var e = this.eventInstanceGroupsById[t];
                    return e ? e.eventInstances.slice() : []
                }, t.prototype.getEventInstancesWithoutId = function (t) {
                    var e, n = this.eventInstanceGroupsById,
                        r = [];
                    for (e in n) e !== t && r.push.apply(r, n[e].eventInstances);
                    return r
                }, t.prototype.addEventInstance = function (t, e) {
                    var n = this.eventInstanceGroupsById;
                    (n[e] || (n[e] = new l.default)).eventInstances.push(t), this.tryRelease()
                }, t.prototype.removeEventInstancesForDef = function (t) {
                    var e, n = this.eventInstanceGroupsById,
                        r = n[t.id];
                    r && (e = i.removeMatching(r.eventInstances, function (e) {
                        return e.def === t
                    }), r.eventInstances.length || delete n[t.id], e && this.tryRelease())
                }, t.prototype.tryRelease = function () {
                    this.pendingCnt || (this.freezeDepth ? this.stuntedReleaseCnt++ : this.release())
                }, t.prototype.release = function () {
                    this.releaseCnt++, this.trigger("release", this.eventInstanceGroupsById)
                }, t.prototype.whenReleased = function () {
                    var t = this;
                    return this.releaseCnt ? o.default.resolve(this.eventInstanceGroupsById) : o.default.construct(function (e) {
                        t.one("release", e)
                    })
                }, t.prototype.freeze = function () {
                    this.freezeDepth++ || (this.stuntedReleaseCnt = 0)
                }, t.prototype.thaw = function () {
                    --this.freezeDepth || !this.stuntedReleaseCnt || this.pendingCnt || this.release()
                }, t
            }();
        e.default = u, s.default.mixInto(u)
    }, function (t, e, n) {
        function r(t, e) {
            return t.getPrimitive() === e.getPrimitive()
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(3),
            o = n(4),
            s = n(219),
            a = n(56),
            l = n(6),
            u = n(38),
            d = n(9),
            c = n(20),
            p = n(13),
            h = n(7),
            f = function () {
                function t(t) {
                    this.calendar = t, this.stickySource = new a.default(t), this.otherSources = []
                }
                return t.prototype.requestEvents = function (t, e, n, r) {
                    return !r && this.currentPeriod && this.currentPeriod.isWithinRange(t, e) && n === this.currentPeriod.timezone || this.setPeriod(new s.default(t, e, n)), this.currentPeriod.whenReleased()
                }, t.prototype.addSource = function (t) {
                    this.otherSources.push(t), this.currentPeriod && this.currentPeriod.requestSource(t)
                }, t.prototype.removeSource = function (t) {
                    o.removeExact(this.otherSources, t), this.currentPeriod && this.currentPeriod.purgeSource(t)
                }, t.prototype.removeAllSources = function () {
                    this.otherSources = [], this.currentPeriod && this.currentPeriod.purgeAllSources()
                }, t.prototype.refetchSource = function (t) {
                    var e = this.currentPeriod;
                    e && (e.freeze(), e.purgeSource(t), e.requestSource(t), e.thaw())
                }, t.prototype.refetchAllSources = function () {
                    var t = this.currentPeriod;
                    t && (t.freeze(), t.purgeAllSources(), t.requestSources(this.getSources()), t.thaw())
                }, t.prototype.getSources = function () {
                    return [this.stickySource].concat(this.otherSources)
                }, t.prototype.multiQuerySources = function (t) {
                    t ? i.isArray(t) || (t = [t]) : t = [];
                    var e, n = [];
                    for (e = 0; e < t.length; e++) n.push.apply(n, this.querySources(t[e]));
                    return n
                }, t.prototype.querySources = function (t) {
                    var e, n, o = this.otherSources;
                    for (e = 0; e < o.length; e++)
                        if ((n = o[e]) === t) return [n];
                    return (n = this.getSourceById(l.default.normalizeId(t))) ? [n] : (t = u.default.parse(t, this.calendar), t ? i.grep(o, function (e) {
                        return r(t, e)
                    }) : void 0)
                }, t.prototype.getSourceById = function (t) {
                    return i.grep(this.otherSources, function (e) {
                        return e.id && e.id === t
                    })[0]
                }, t.prototype.setPeriod = function (t) {
                    this.currentPeriod && (this.unbindPeriod(this.currentPeriod), this.currentPeriod = null), this.currentPeriod = t, this.bindPeriod(t), t.requestSources(this.getSources())
                }, t.prototype.bindPeriod = function (t) {
                    this.listenTo(t, "release", function (t) {
                        this.trigger("release", t)
                    })
                }, t.prototype.unbindPeriod = function (t) {
                    this.stopListeningTo(t)
                }, t.prototype.getEventDefByUid = function (t) {
                    if (this.currentPeriod) return this.currentPeriod.getEventDefByUid(t)
                }, t.prototype.addEventDef = function (t, e) {
                    e && this.stickySource.addEventDef(t), this.currentPeriod && this.currentPeriod.addEventDef(t)
                }, t.prototype.removeEventDefsById = function (t) {
                    this.getSources().forEach(function (e) {
                        e.removeEventDefsById(t)
                    }), this.currentPeriod && this.currentPeriod.removeEventDefsById(t)
                }, t.prototype.removeAllEventDefs = function () {
                    this.getSources().forEach(function (t) {
                        t.removeAllEventDefs()
                    }), this.currentPeriod && this.currentPeriod.removeAllEventDefs()
                }, t.prototype.mutateEventsWithId = function (t, e) {
                    var n, r = this.currentPeriod,
                        i = [];
                    return r ? (r.freeze(), n = r.getEventDefsById(t), n.forEach(function (t) {
                        r.removeEventDef(t), i.push(e.mutateSingle(t)), r.addEventDef(t)
                    }), r.thaw(), function () {
                        r.freeze();
                        for (var t = 0; t < n.length; t++) r.removeEventDef(n[t]), i[t](), r.addEventDef(n[t]);
                        r.thaw()
                    }) : function () {}
                }, t.prototype.buildMutatedEventInstanceGroup = function (t, e) {
                    var n, r, i = this.getEventDefsById(t),
                        o = [];
                    for (n = 0; n < i.length; n++)(r = i[n].clone()) instanceof d.default && (e.mutateSingle(r), o.push.apply(o, r.buildInstances()));
                    return new c.default(o)
                }, t.prototype.freeze = function () {
                    this.currentPeriod && this.currentPeriod.freeze()
                }, t.prototype.thaw = function () {
                    this.currentPeriod && this.currentPeriod.thaw()
                }, t.prototype.getEventDefsById = function (t) {
                    return this.currentPeriod.getEventDefsById(t)
                }, t.prototype.getEventInstances = function () {
                    return this.currentPeriod.getEventInstances()
                }, t.prototype.getEventInstancesWithId = function (t) {
                    return this.currentPeriod.getEventInstancesWithId(t)
                }, t.prototype.getEventInstancesWithoutId = function (t) {
                    return this.currentPeriod.getEventInstancesWithoutId(t)
                }, t
            }();
        e.default = f, p.default.mixInto(f), h.default.mixInto(f)
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(22),
            o = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e
            }(i.default);
        e.default = o, o.prototype.classes = {
            widget: "fc-unthemed",
            widgetHeader: "fc-widget-header",
            widgetContent: "fc-widget-content",
            buttonGroup: "fc-button-group",
            button: "fc-button",
            cornerLeft: "fc-corner-left",
            cornerRight: "fc-corner-right",
            stateDefault: "fc-state-default",
            stateActive: "fc-state-active",
            stateDisabled: "fc-state-disabled",
            stateHover: "fc-state-hover",
            stateDown: "fc-state-down",
            popoverHeader: "fc-widget-header",
            popoverContent: "fc-widget-content",
            headerRow: "fc-widget-header",
            dayRow: "fc-widget-content",
            listView: "fc-widget-content"
        }, o.prototype.baseIconClass = "fc-icon", o.prototype.iconClasses = {
            close: "fc-icon-x",
            prev: "fc-icon-left-single-arrow",
            next: "fc-icon-right-single-arrow",
            prevYear: "fc-icon-left-double-arrow",
            nextYear: "fc-icon-right-double-arrow"
        }, o.prototype.iconOverrideOption = "buttonIcons", o.prototype.iconOverrideCustomButtonOption = "icon", o.prototype.iconOverridePrefix = "fc-icon-"
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(22),
            o = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e
            }(i.default);
        e.default = o, o.prototype.classes = {
            widget: "ui-widget",
            widgetHeader: "ui-widget-header",
            widgetContent: "ui-widget-content",
            buttonGroup: "fc-button-group",
            button: "ui-button",
            cornerLeft: "ui-corner-left",
            cornerRight: "ui-corner-right",
            stateDefault: "ui-state-default",
            stateActive: "ui-state-active",
            stateDisabled: "ui-state-disabled",
            stateHover: "ui-state-hover",
            stateDown: "ui-state-down",
            today: "ui-state-highlight",
            popoverHeader: "ui-widget-header",
            popoverContent: "ui-widget-content",
            headerRow: "ui-widget-header",
            dayRow: "ui-widget-content",
            listView: "ui-widget-content"
        }, o.prototype.baseIconClass = "ui-icon", o.prototype.iconClasses = {
            close: "ui-icon-closethick",
            prev: "ui-icon-circle-triangle-w",
            next: "ui-icon-circle-triangle-e",
            prevYear: "ui-icon-seek-prev",
            nextYear: "ui-icon-seek-next"
        }, o.prototype.iconOverrideOption = "themeButtonIcons", o.prototype.iconOverrideCustomButtonOption = "themeIcon", o.prototype.iconOverridePrefix = "ui-icon-"
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(21),
            s = n(6),
            a = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.parse = function (t, e) {
                    var n;
                    return i.isFunction(t.events) ? n = t : i.isFunction(t) && (n = {
                        events: t
                    }), !!n && s.default.parse.call(this, n, e)
                }, e.prototype.fetch = function (t, e, n) {
                    var r = this;
                    return this.calendar.pushLoading(), o.default.construct(function (i) {
                        r.func.call(r.calendar, t.clone(), e.clone(), n, function (t) {
                            r.calendar.popLoading(), i(r.parseEventDefs(t))
                        })
                    })
                }, e.prototype.getPrimitive = function () {
                    return this.func
                }, e.prototype.applyManualStandardProps = function (e) {
                    var n = t.prototype.applyManualStandardProps.call(this, e);
                    return this.func = e.events, n
                }, e
            }(s.default);
        e.default = a, a.defineStandardProps({
            events: !1
        })
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(4),
            s = n(21),
            a = n(6),
            l = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.parse = function (t, e) {
                    var n;
                    return "string" == typeof t.url ? n = t : "string" == typeof t && (n = {
                        url: t
                    }), !!n && a.default.parse.call(this, n, e)
                }, e.prototype.fetch = function (t, n, r) {
                    var a = this,
                        l = this.ajaxSettings,
                        u = l.success,
                        d = l.error,
                        c = this.buildRequestParams(t, n, r);
                    return this.calendar.pushLoading(), s.default.construct(function (t, n) {
                        i.ajax(i.extend({}, e.AJAX_DEFAULTS, l, {
                            url: a.url,
                            data: c,
                            success: function (e, r, s) {
                                var l;
                                a.calendar.popLoading(), e ? (l = o.applyAll(u, a, [e, r, s]), i.isArray(l) && (e = l), t(a.parseEventDefs(e))) : n()
                            },
                            error: function (t, e, r) {
                                a.calendar.popLoading(), o.applyAll(d, a, [t, e, r]), n()
                            }
                        }))
                    })
                }, e.prototype.buildRequestParams = function (t, e, n) {
                    var r, o, s, a, l = this.calendar,
                        u = this.ajaxSettings,
                        d = {};
                    return r = this.startParam, null == r && (r = l.opt("startParam")), o = this.endParam, null == o && (o = l.opt("endParam")), s = this.timezoneParam, null == s && (s = l.opt("timezoneParam")), a = i.isFunction(u.data) ? u.data() : u.data || {}, i.extend(d, a), d[r] = t.format(), d[o] = e.format(), n && "local" !== n && (d[s] = n), d
                }, e.prototype.getPrimitive = function () {
                    return this.url
                }, e.prototype.applyMiscProps = function (t) {
                    this.ajaxSettings = t
                }, e.AJAX_DEFAULTS = {
                    dataType: "json",
                    cache: !1
                }, e
            }(a.default);
        e.default = l, l.defineStandardProps({
            url: !0,
            startParam: !0,
            endParam: !0,
            timezoneParam: !0
        })
    }, function (t, e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = function () {
            function t(t) {
                this.items = t || []
            }
            return t.prototype.proxyCall = function (t) {
                for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                var r = [];
                return this.items.forEach(function (n) {
                    r.push(n[t].apply(n, e))
                }), r
            }, t
        }();
        e.default = n
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(3),
            i = n(4),
            o = n(7),
            s = function () {
                function t(t, e) {
                    this.isFollowing = !1, this.isHidden = !1, this.isAnimating = !1, this.options = e = e || {}, this.sourceEl = t, this.parentEl = e.parentEl ? r(e.parentEl) : t.parent()
                }
                return t.prototype.start = function (t) {
                    this.isFollowing || (this.isFollowing = !0, this.y0 = i.getEvY(t), this.x0 = i.getEvX(t), this.topDelta = 0, this.leftDelta = 0, this.isHidden || this.updatePosition(), i.getEvIsTouch(t) ? this.listenTo(r(document), "touchmove", this.handleMove) : this.listenTo(r(document), "mousemove", this.handleMove))
                }, t.prototype.stop = function (t, e) {
                    var n = this,
                        i = this.options.revertDuration,
                        o = function () {
                            n.isAnimating = !1, n.removeElement(), n.top0 = n.left0 = null, e && e()
                        };
                    this.isFollowing && !this.isAnimating && (this.isFollowing = !1, this.stopListeningTo(r(document)), t && i && !this.isHidden ? (this.isAnimating = !0, this.el.animate({
                        top: this.top0,
                        left: this.left0
                    }, {
                        duration: i,
                        complete: o
                    })) : o())
                }, t.prototype.getEl = function () {
                    var t = this.el;
                    return t || (t = this.el = this.sourceEl.clone().addClass(this.options.additionalClass || "").css({
                        position: "absolute",
                        visibility: "",
                        display: this.isHidden ? "none" : "",
                        margin: 0,
                        right: "auto",
                        bottom: "auto",
                        width: this.sourceEl.width(),
                        height: this.sourceEl.height(),
                        opacity: this.options.opacity || "",
                        zIndex: this.options.zIndex
                    }), t.addClass("fc-unselectable"), t.appendTo(this.parentEl)), t
                }, t.prototype.removeElement = function () {
                    this.el && (this.el.remove(), this.el = null)
                }, t.prototype.updatePosition = function () {
                    var t, e;
                    this.getEl(), null == this.top0 && (t = this.sourceEl.offset(), e = this.el.offsetParent().offset(), this.top0 = t.top - e.top, this.left0 = t.left - e.left), this.el.css({
                        top: this.top0 + this.topDelta,
                        left: this.left0 + this.leftDelta
                    })
                }, t.prototype.handleMove = function (t) {
                    this.topDelta = i.getEvY(t) - this.y0, this.leftDelta = i.getEvX(t) - this.x0, this.isHidden || this.updatePosition()
                }, t.prototype.hide = function () {
                    this.isHidden || (this.isHidden = !0, this.el && this.el.hide())
                }, t.prototype.show = function () {
                    this.isHidden && (this.isHidden = !1, this.updatePosition(), this.getEl().show())
                }, t
            }();
        e.default = s, o.default.mixInto(s)
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(3),
            i = n(4),
            o = n(7),
            s = function () {
                function t(t) {
                    this.isHidden = !0, this.margin = 10, this.options = t || {}
                }
                return t.prototype.show = function () {
                    this.isHidden && (this.el || this.render(), this.el.show(), this.position(), this.isHidden = !1, this.trigger("show"))
                }, t.prototype.hide = function () {
                    this.isHidden || (this.el.hide(), this.isHidden = !0, this.trigger("hide"))
                }, t.prototype.render = function () {
                    var t = this,
                        e = this.options;
                    this.el = r('<div class="fc-popover">').addClass(e.className || "").css({
                        top: 0,
                        left: 0
                    }).append(e.content).appendTo(e.parentEl), this.el.on("click", ".fc-close", function () {
                        t.hide()
                    }), e.autoHide && this.listenTo(r(document), "mousedown", this.documentMousedown)
                }, t.prototype.documentMousedown = function (t) {
                    this.el && !r(t.target).closest(this.el).length && this.hide()
                }, t.prototype.removeElement = function () {
                    this.hide(), this.el && (this.el.remove(), this.el = null), this.stopListeningTo(r(document), "mousedown")
                }, t.prototype.position = function () {
                    var t, e, n, o, s, a = this.options,
                        l = this.el.offsetParent().offset(),
                        u = this.el.outerWidth(),
                        d = this.el.outerHeight(),
                        c = r(window),
                        p = i.getScrollParent(this.el);
                    o = a.top || 0, s = void 0 !== a.left ? a.left : void 0 !== a.right ? a.right - u : 0, p.is(window) || p.is(document) ? (p = c, t = 0, e = 0) : (n = p.offset(), t = n.top, e = n.left), t += c.scrollTop(), e += c.scrollLeft(), !1 !== a.viewportConstrain && (o = Math.min(o, t + p.outerHeight() - d - this.margin), o = Math.max(o, t + this.margin), s = Math.min(s, e + p.outerWidth() - u - this.margin), s = Math.max(s, e + this.margin)), this.el.css({
                        top: o - l.top,
                        left: s - l.left
                    })
                }, t.prototype.trigger = function (t) {
                    this.options[t] && this.options[t].apply(this, Array.prototype.slice.call(arguments, 1))
                }, t
            }();
        e.default = s, o.default.mixInto(s)
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(13),
            i = function () {
                function t() {
                    this.q = [], this.isPaused = !1, this.isRunning = !1
                }
                return t.prototype.queue = function () {
                    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
                    this.q.push.apply(this.q, t), this.tryStart()
                }, t.prototype.pause = function () {
                    this.isPaused = !0
                }, t.prototype.resume = function () {
                    this.isPaused = !1, this.tryStart()
                }, t.prototype.getIsIdle = function () {
                    return !this.isRunning && !this.isPaused
                }, t.prototype.tryStart = function () {
                    !this.isRunning && this.canRunNext() && (this.isRunning = !0, this.trigger("start"), this.runRemaining())
                }, t.prototype.canRunNext = function () {
                    return !this.isPaused && this.q.length
                }, t.prototype.runRemaining = function () {
                    var t, e, n = this;
                    do {
                        if (t = this.q.shift(), (e = this.runTask(t)) && e.then) return void e.then(function () {
                            n.canRunNext() && n.runRemaining()
                        })
                    } while (this.canRunNext());
                    this.trigger("stop"), this.isRunning = !1, this.tryStart()
                }, t.prototype.runTask = function (t) {
                    return t()
                }, t
            }();
        e.default = i, r.default.mixInto(i)
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(228),
            o = function (t) {
                function e(e) {
                    var n = t.call(this) || this;
                    return n.waitsByNamespace = e || {}, n
                }
                return r.__extends(e, t), e.prototype.queue = function (t, e, n) {
                    var r, i = {
                        func: t,
                        namespace: e,
                        type: n
                    };
                    e && (r = this.waitsByNamespace[e]), this.waitNamespace && (e === this.waitNamespace && null != r ? this.delayWait(r) : (this.clearWait(), this.tryStart())), this.compoundTask(i) && (this.waitNamespace || null == r ? this.tryStart() : this.startWait(e, r))
                }, e.prototype.startWait = function (t, e) {
                    this.waitNamespace = t, this.spawnWait(e)
                }, e.prototype.delayWait = function (t) {
                    clearTimeout(this.waitId), this.spawnWait(t)
                }, e.prototype.spawnWait = function (t) {
                    var e = this;
                    this.waitId = setTimeout(function () {
                        e.waitNamespace = null, e.tryStart()
                    }, t)
                }, e.prototype.clearWait = function () {
                    this.waitNamespace && (clearTimeout(this.waitId), this.waitId = null, this.waitNamespace = null)
                }, e.prototype.canRunNext = function () {
                    if (!t.prototype.canRunNext.call(this)) return !1;
                    if (this.waitNamespace) {
                        for (var e = this.q, n = 0; n < e.length; n++)
                            if (e[n].namespace !== this.waitNamespace) return !0;
                        return !1
                    }
                    return !0
                }, e.prototype.runTask = function (t) {
                    t.func()
                }, e.prototype.compoundTask = function (t) {
                    var e, n, r = this.q,
                        i = !0;
                    if (t.namespace && "destroy" === t.type)
                        for (e = r.length - 1; e >= 0; e--)
                            if (n = r[e], n.namespace === t.namespace) switch (n.type) {
                                case "init":
                                    i = !1;
                                case "add":
                                case "remove":
                                    r.splice(e, 1)
                            }
                    return i && r.push(t), i
                }, e
            }(i.default);
        e.default = o
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(51),
            o = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.setElement = function (t) {
                    this.el = t, this.bindGlobalHandlers(), this.renderSkeleton(), this.set("isInDom", !0)
                }, e.prototype.removeElement = function () {
                    this.unset("isInDom"), this.unrenderSkeleton(), this.unbindGlobalHandlers(), this.el.remove()
                }, e.prototype.bindGlobalHandlers = function () {}, e.prototype.unbindGlobalHandlers = function () {}, e.prototype.renderSkeleton = function () {}, e.prototype.unrenderSkeleton = function () {}, e
            }(i.default);
        e.default = o
    }, function (t, e, n) {
        function r(t) {
            var e, n, r, i = [];
            for (e in t)
                for (n = t[e].eventInstances, r = 0; r < n.length; r++) i.push(n[r].toLegacy());
            return i
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(2),
            o = n(3),
            s = n(0),
            a = n(4),
            l = n(11),
            u = n(49),
            d = n(230),
            c = n(19),
            p = function (t) {
                function e(n, r) {
                    var i = t.call(this) || this;
                    return i.isRTL = !1, i.hitsNeededDepth = 0, i.hasAllDayBusinessHours = !1, i.isDatesRendered = !1, n && (i.view = n), r && (i.options = r), i.uid = String(e.guid++), i.childrenByUid = {}, i.nextDayThreshold = s.duration(i.opt("nextDayThreshold")), i.isRTL = i.opt("isRTL"), i.fillRendererClass && (i.fillRenderer = new i.fillRendererClass(i)), i.eventRendererClass && (i.eventRenderer = new i.eventRendererClass(i, i.fillRenderer)), i.helperRendererClass && i.eventRenderer && (i.helperRenderer = new i.helperRendererClass(i, i.eventRenderer)), i.businessHourRendererClass && i.fillRenderer && (i.businessHourRenderer = new i.businessHourRendererClass(i, i.fillRenderer)), i
                }
                return i.__extends(e, t), e.prototype.addChild = function (t) {
                    return !this.childrenByUid[t.uid] && (this.childrenByUid[t.uid] = t, !0)
                }, e.prototype.removeChild = function (t) {
                    return !!this.childrenByUid[t.uid] && (delete this.childrenByUid[t.uid], !0)
                }, e.prototype.updateSize = function (t, e, n) {
                    this.callChildren("updateSize", arguments)
                }, e.prototype.opt = function (t) {
                    return this._getView().opt(t)
                }, e.prototype.publiclyTrigger = function () {
                    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
                    var n = this._getCalendar();
                    return n.publiclyTrigger.apply(n, t)
                }, e.prototype.hasPublicHandlers = function () {
                    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
                    var n = this._getCalendar();
                    return n.hasPublicHandlers.apply(n, t)
                }, e.prototype.executeDateRender = function (t) {
                    this.dateProfile = t, this.renderDates(t), this.isDatesRendered = !0, this.callChildren("executeDateRender", arguments)
                }, e.prototype.executeDateUnrender = function () {
                    this.callChildren("executeDateUnrender", arguments), this.dateProfile = null, this.unrenderDates(), this.isDatesRendered = !1
                }, e.prototype.renderDates = function (t) {}, e.prototype.unrenderDates = function () {}, e.prototype.getNowIndicatorUnit = function () {}, e.prototype.renderNowIndicator = function (t) {
                    this.callChildren("renderNowIndicator", arguments)
                }, e.prototype.unrenderNowIndicator = function () {
                    this.callChildren("unrenderNowIndicator", arguments)
                }, e.prototype.renderBusinessHours = function (t) {
                    this.businessHourRenderer && this.businessHourRenderer.render(t), this.callChildren("renderBusinessHours", arguments)
                }, e.prototype.unrenderBusinessHours = function () {
                    this.callChildren("unrenderBusinessHours", arguments), this.businessHourRenderer && this.businessHourRenderer.unrender()
                }, e.prototype.executeEventRender = function (t) {
                    this.eventRenderer ? (this.eventRenderer.rangeUpdated(), this.eventRenderer.render(t)) : this.renderEvents && this.renderEvents(r(t)), this.callChildren("executeEventRender", arguments)
                }, e.prototype.executeEventUnrender = function () {
                    this.callChildren("executeEventUnrender", arguments), this.eventRenderer ? this.eventRenderer.unrender() : this.destroyEvents && this.destroyEvents()
                }, e.prototype.getBusinessHourSegs = function () {
                    var t = this.getOwnBusinessHourSegs();
                    return this.iterChildren(function (e) {
                        t.push.apply(t, e.getBusinessHourSegs())
                    }), t
                }, e.prototype.getOwnBusinessHourSegs = function () {
                    return this.businessHourRenderer ? this.businessHourRenderer.getSegs() : []
                }, e.prototype.getEventSegs = function () {
                    var t = this.getOwnEventSegs();
                    return this.iterChildren(function (e) {
                        t.push.apply(t, e.getEventSegs())
                    }), t
                }, e.prototype.getOwnEventSegs = function () {
                    return this.eventRenderer ? this.eventRenderer.getSegs() : []
                }, e.prototype.triggerAfterEventsRendered = function () {
                    this.triggerAfterEventSegsRendered(this.getEventSegs()), this.publiclyTrigger("eventAfterAllRender", {
                        context: this,
                        args: [this]
                    })
                }, e.prototype.triggerAfterEventSegsRendered = function (t) {
                    var e = this;
                    this.hasPublicHandlers("eventAfterRender") && t.forEach(function (t) {
                        var n;
                        t.el && (n = t.footprint.getEventLegacy(), e.publiclyTrigger("eventAfterRender", {
                            context: n,
                            args: [n, t.el, e]
                        }))
                    })
                }, e.prototype.triggerBeforeEventsDestroyed = function () {
                    this.triggerBeforeEventSegsDestroyed(this.getEventSegs())
                }, e.prototype.triggerBeforeEventSegsDestroyed = function (t) {
                    var e = this;
                    this.hasPublicHandlers("eventDestroy") && t.forEach(function (t) {
                        var n;
                        t.el && (n = t.footprint.getEventLegacy(), e.publiclyTrigger("eventDestroy", {
                            context: n,
                            args: [n, t.el, e]
                        }))
                    })
                }, e.prototype.showEventsWithId = function (t) {
                    this.getEventSegs().forEach(function (e) {
                        e.footprint.eventDef.id === t && e.el && e.el.css("visibility", "")
                    }), this.callChildren("showEventsWithId", arguments)
                }, e.prototype.hideEventsWithId = function (t) {
                    this.getEventSegs().forEach(function (e) {
                        e.footprint.eventDef.id === t && e.el && e.el.css("visibility", "hidden")
                    }), this.callChildren("hideEventsWithId", arguments)
                }, e.prototype.renderDrag = function (t, e, n) {
                    var r = !1;
                    return this.iterChildren(function (i) {
                        i.renderDrag(t, e, n) && (r = !0)
                    }), r
                }, e.prototype.unrenderDrag = function () {
                    this.callChildren("unrenderDrag", arguments)
                }, e.prototype.renderEventResize = function (t, e, n) {
                    this.callChildren("renderEventResize", arguments)
                }, e.prototype.unrenderEventResize = function () {
                    this.callChildren("unrenderEventResize", arguments)
                }, e.prototype.renderSelectionFootprint = function (t) {
                    this.renderHighlight(t), this.callChildren("renderSelectionFootprint", arguments)
                }, e.prototype.unrenderSelection = function () {
                    this.unrenderHighlight(), this.callChildren("unrenderSelection", arguments)
                }, e.prototype.renderHighlight = function (t) {
                    this.fillRenderer && this.fillRenderer.renderFootprint("highlight", t, {
                        getClasses: function () {
                            return ["fc-highlight"]
                        }
                    }), this.callChildren("renderHighlight", arguments)
                }, e.prototype.unrenderHighlight = function () {
                    this.fillRenderer && this.fillRenderer.unrender("highlight"), this.callChildren("unrenderHighlight", arguments)
                }, e.prototype.hitsNeeded = function () {
                    this.hitsNeededDepth++ || this.prepareHits(), this.callChildren("hitsNeeded", arguments)
                }, e.prototype.hitsNotNeeded = function () {
                    this.hitsNeededDepth && !--this.hitsNeededDepth && this.releaseHits(), this.callChildren("hitsNotNeeded", arguments)
                }, e.prototype.prepareHits = function () {}, e.prototype.releaseHits = function () {}, e.prototype.queryHit = function (t, e) {
                    var n, r, i = this.childrenByUid;
                    for (n in i)
                        if (r = i[n].queryHit(t, e)) break;
                    return r
                }, e.prototype.getSafeHitFootprint = function (t) {
                    var e = this.getHitFootprint(t);
                    return this.dateProfile.activeUnzonedRange.containsRange(e.unzonedRange) ? e : null
                }, e.prototype.getHitFootprint = function (t) {}, e.prototype.getHitEl = function (t) {}, e.prototype.eventRangesToEventFootprints = function (t) {
                    var e, n = [];
                    for (e = 0; e < t.length; e++) n.push.apply(n, this.eventRangeToEventFootprints(t[e]));
                    return n
                }, e.prototype.eventRangeToEventFootprints = function (t) {
                    return [c.eventRangeToEventFootprint(t)]
                }, e.prototype.eventFootprintsToSegs = function (t) {
                    var e, n = [];
                    for (e = 0; e < t.length; e++) n.push.apply(n, this.eventFootprintToSegs(t[e]));
                    return n
                }, e.prototype.eventFootprintToSegs = function (t) {
                    var e, n, r, i = t.componentFootprint.unzonedRange;
                    for (e = this.componentFootprintToSegs(t.componentFootprint), n = 0; n < e.length; n++) r = e[n], i.isStart || (r.isStart = !1), i.isEnd || (r.isEnd = !1), r.footprint = t;
                    return e
                }, e.prototype.componentFootprintToSegs = function (t) {
                    return []
                }, e.prototype.callChildren = function (t, e) {
                    this.iterChildren(function (n) {
                        n[t].apply(n, e)
                    })
                }, e.prototype.iterChildren = function (t) {
                    var e, n = this.childrenByUid;
                    for (e in n) t(n[e])
                }, e.prototype._getCalendar = function () {
                    var t = this;
                    return t.calendar || t.view.calendar
                }, e.prototype._getView = function () {
                    return this.view
                }, e.prototype._getDateProfile = function () {
                    return this._getView().get("dateProfile")
                }, e.prototype.buildGotoAnchorHtml = function (t, e, n) {
                    var r, i, s, u;
                    return o.isPlainObject(t) ? (r = t.date, i = t.type, s = t.forceOff) : r = t, r = l.default(r), u = {
                        date: r.format("YYYY-MM-DD"),
                        type: i || "day"
                    }, "string" == typeof e && (n = e, e = null), e = e ? " " + a.attrsToStr(e) : "", n = n || "", !s && this.opt("navLinks") ? "<a" + e + ' data-goto="' + a.htmlEscape(JSON.stringify(u)) + '">' + n + "</a>" : "<span" + e + ">" + n + "</span>"
                }, e.prototype.getAllDayHtml = function () {
                    return this.opt("allDayHtml") || a.htmlEscape(this.opt("allDayText"))
                }, e.prototype.getDayClasses = function (t, e) {
                    var n, r = this._getView(),
                        i = [];
                    return this.dateProfile.activeUnzonedRange.containsDate(t) ? (i.push("fc-" + a.dayIDs[t.day()]), r.isDateInOtherMonth(t, this.dateProfile) && i.push("fc-other-month"), n = r.calendar.getNow(), t.isSame(n, "day") ? (i.push("fc-today"), !0 !== e && i.push(r.calendar.theme.getClass("today"))) : t < n ? i.push("fc-past") : i.push("fc-future")) : i.push("fc-disabled-day"), i
                }, e.prototype.formatRange = function (t, e, n, r) {
                    var i = t.end;
                    return e && (i = i.clone().subtract(1)), u.formatRange(t.start, i, n, r, this.isRTL)
                }, e.prototype.currentRangeAs = function (t) {
                    return this._getDateProfile().currentUnzonedRange.as(t)
                }, e.prototype.computeDayRange = function (t) {
                    var e = this._getCalendar(),
                        n = e.msToUtcMoment(t.startMs, !0),
                        r = e.msToUtcMoment(t.endMs),
                        i = +r.time(),
                        o = r.clone().stripTime();
                    return i && i >= this.nextDayThreshold && o.add(1, "days"), o <= n && (o = n.clone().add(1, "days")), {
                        start: n,
                        end: o
                    }
                }, e.prototype.isMultiDayRange = function (t) {
                    var e = this.computeDayRange(t);
                    return e.end.diff(e.start, "days") > 1
                }, e.guid = 0, e
            }(d.default);
        e.default = p
    }, function (t, e, n) {
        function r(t, e) {
            return null == e ? t : i.isFunction(e) ? t.filter(e) : (e += "", t.filter(function (t) {
                return t.id == e || t._id === e
            }))
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(3),
            o = n(0),
            s = n(4),
            a = n(33),
            l = n(225),
            u = n(23),
            d = n(13),
            c = n(7),
            p = n(257),
            h = n(258),
            f = n(259),
            g = n(217),
            v = n(32),
            y = n(11),
            m = n(5),
            b = n(12),
            w = n(16),
            D = n(220),
            E = n(218),
            S = n(38),
            C = n(36),
            R = n(9),
            T = n(39),
            M = n(6),
            I = n(57),
            H = function () {
                function t(t, e) {
                    this.loadingLevel = 0, this.ignoreUpdateViewSize = 0, this.freezeContentHeightDepth = 0, u.default.needed(), this.el = t, this.viewsByType = {}, this.optionsManager = new h.default(this, e), this.viewSpecManager = new f.default(this.optionsManager, this), this.initMomentInternals(), this.initCurrentDate(), this.initEventManager(), this.constraints = new g.default(this.eventManager, this), this.constructed()
                }
                return t.prototype.constructed = function () {}, t.prototype.getView = function () {
                    return this.view
                }, t.prototype.publiclyTrigger = function (t, e) {
                    var n, r, o = this.opt(t);
                    if (i.isPlainObject(e) ? (n = e.context, r = e.args) : i.isArray(e) && (r = e), null == n && (n = this.el[0]), r || (r = []), this.triggerWith(t, n, r), o) return o.apply(n, r)
                }, t.prototype.hasPublicHandlers = function (t) {
                    return this.hasHandlers(t) || this.opt(t)
                }, t.prototype.option = function (t, e) {
                    var n;
                    if ("string" == typeof t) {
                        if (void 0 === e) return this.optionsManager.get(t);
                        n = {}, n[t] = e, this.optionsManager.add(n)
                    } else "object" == typeof t && this.optionsManager.add(t)
                }, t.prototype.opt = function (t) {
                    return this.optionsManager.get(t)
                }, t.prototype.instantiateView = function (t) {
                    var e = this.viewSpecManager.getViewSpec(t);
                    if (!e) throw new Error('View type "' + t + '" is not valid');
                    return new e.class(this, e)
                }, t.prototype.isValidViewType = function (t) {
                    return Boolean(this.viewSpecManager.getViewSpec(t))
                }, t.prototype.changeView = function (t, e) {
                    e && (e.start && e.end ? this.optionsManager.recordOverrides({
                        visibleRange: e
                    }) : this.currentDate = this.moment(e).stripZone()), this.renderView(t)
                }, t.prototype.zoomTo = function (t, e) {
                    var n;
                    e = e || "day", n = this.viewSpecManager.getViewSpec(e) || this.viewSpecManager.getUnitViewSpec(e), this.currentDate = t.clone(), this.renderView(n ? n.type : null)
                }, t.prototype.initCurrentDate = function () {
                    var t = this.opt("defaultDate");
                    this.currentDate = null != t ? this.moment(t).stripZone() : this.getNow()
                }, t.prototype.prev = function () {
                    var t = this.view,
                        e = t.dateProfileGenerator.buildPrev(t.get("dateProfile"));
                    e.isValid && (this.currentDate = e.date, this.renderView())
                }, t.prototype.next = function () {
                    var t = this.view,
                        e = t.dateProfileGenerator.buildNext(t.get("dateProfile"));
                    e.isValid && (this.currentDate = e.date, this.renderView())
                }, t.prototype.prevYear = function () {
                    this.currentDate.add(-1, "years"), this.renderView()
                }, t.prototype.nextYear = function () {
                    this.currentDate.add(1, "years"), this.renderView()
                }, t.prototype.today = function () {
                    this.currentDate = this.getNow(), this.renderView()
                }, t.prototype.gotoDate = function (t) {
                    this.currentDate = this.moment(t).stripZone(), this.renderView()
                }, t.prototype.incrementDate = function (t) {
                    this.currentDate.add(o.duration(t)), this.renderView()
                }, t.prototype.getDate = function () {
                    return this.applyTimezone(this.currentDate)
                }, t.prototype.pushLoading = function () {
                    this.loadingLevel++ || this.publiclyTrigger("loading", [!0, this.view])
                }, t.prototype.popLoading = function () {
                    --this.loadingLevel || this.publiclyTrigger("loading", [!1, this.view])
                }, t.prototype.render = function () {
                    this.contentEl ? this.elementVisible() && (this.calcSize(), this.updateViewSize()) : this.initialRender()
                }, t.prototype.initialRender = function () {
                    var t = this,
                        e = this.el;
                    e.addClass("fc"), e.on("click.fc", "a[data-goto]", function (e) {
                        var n = i(e.currentTarget),
                            r = n.data("goto"),
                            o = t.moment(r.date),
                            a = r.type,
                            l = t.view.opt("navLink" + s.capitaliseFirstLetter(a) + "Click");
                        "function" == typeof l ? l(o, e) : ("string" == typeof l && (a = l), t.zoomTo(o, a))
                    }), this.optionsManager.watch("settingTheme", ["?theme", "?themeSystem"], function (n) {
                        var r = I.getThemeSystemClass(n.themeSystem || n.theme),
                            i = new r(t.optionsManager),
                            o = i.getClass("widget");
                        t.theme = i, o && e.addClass(o)
                    }, function () {
                        var n = t.theme.getClass("widget");
                        t.theme = null, n && e.removeClass(n)
                    }), this.optionsManager.watch("settingBusinessHourGenerator", ["?businessHours"], function (e) {
                        t.businessHourGenerator = new E.default(e.businessHours, t), t.view && t.view.set("businessHourGenerator", t.businessHourGenerator)
                    }, function () {
                        t.businessHourGenerator = null
                    }), this.optionsManager.watch("applyingDirClasses", ["?isRTL", "?locale"], function (t) {
                        e.toggleClass("fc-ltr", !t.isRTL), e.toggleClass("fc-rtl", t.isRTL)
                    }), this.contentEl = i("<div class='fc-view-container'>").prependTo(e), this.initToolbars(), this.renderHeader(), this.renderFooter(), this.renderView(this.opt("defaultView")), this.opt("handleWindowResize") && i(window).resize(this.windowResizeProxy = s.debounce(this.windowResize.bind(this), this.opt("windowResizeDelay")))
                }, t.prototype.destroy = function () {
                    this.view && this.clearView(), this.toolbarsManager.proxyCall("removeElement"), this.contentEl.remove(), this.el.removeClass("fc fc-ltr fc-rtl"), this.optionsManager.unwatch("settingTheme"), this.optionsManager.unwatch("settingBusinessHourGenerator"), this.el.off(".fc"), this.windowResizeProxy && (i(window).unbind("resize", this.windowResizeProxy), this.windowResizeProxy = null), u.default.unneeded()
                }, t.prototype.elementVisible = function () {
                    return this.el.is(":visible")
                }, t.prototype.bindViewHandlers = function (t) {
                    var e = this;
                    t.watch("titleForCalendar", ["title"], function (n) {
                        t === e.view && e.setToolbarsTitle(n.title)
                    }), t.watch("dateProfileForCalendar", ["dateProfile"], function (n) {
                        t === e.view && (e.currentDate = n.dateProfile.date, e.updateToolbarButtons(n.dateProfile))
                    })
                }, t.prototype.unbindViewHandlers = function (t) {
                    t.unwatch("titleForCalendar"), t.unwatch("dateProfileForCalendar")
                }, t.prototype.renderView = function (t) {
                    var e, n = this.view;
                    this.freezeContentHeight(), n && t && n.type !== t && this.clearView(), !this.view && t && (e = this.view = this.viewsByType[t] || (this.viewsByType[t] = this.instantiateView(t)), this.bindViewHandlers(e), e.startBatchRender(), e.setElement(i("<div class='fc-view fc-" + t + "-view'>").appendTo(this.contentEl)), this.toolbarsManager.proxyCall("activateButton", t)), this.view && (this.view.get("businessHourGenerator") !== this.businessHourGenerator && this.view.set("businessHourGenerator", this.businessHourGenerator), this.view.setDate(this.currentDate), e && e.stopBatchRender()), this.thawContentHeight()
                }, t.prototype.clearView = function () {
                    var t = this.view;
                    this.toolbarsManager.proxyCall("deactivateButton", t.type), this.unbindViewHandlers(t), t.removeElement(), t.unsetDate(), this.view = null
                }, t.prototype.reinitView = function () {
                    var t = this.view,
                        e = t.queryScroll();
                    this.freezeContentHeight(), this.clearView(), this.calcSize(), this.renderView(t.type), this.view.applyScroll(e), this.thawContentHeight()
                }, t.prototype.getSuggestedViewHeight = function () {
                    return null == this.suggestedViewHeight && this.calcSize(), this.suggestedViewHeight
                }, t.prototype.isHeightAuto = function () {
                    return "auto" === this.opt("contentHeight") || "auto" === this.opt("height")
                }, t.prototype.updateViewSize = function (t) {
                    void 0 === t && (t = !1);
                    var e, n = this.view;
                    if (!this.ignoreUpdateViewSize && n) return t && (this.calcSize(), e = n.queryScroll()), this.ignoreUpdateViewSize++, n.updateSize(this.getSuggestedViewHeight(), this.isHeightAuto(), t), this.ignoreUpdateViewSize--, t && n.applyScroll(e), !0
                }, t.prototype.calcSize = function () {
                    this.elementVisible() && this._calcSize()
                }, t.prototype._calcSize = function () {
                    var t = this.opt("contentHeight"),
                        e = this.opt("height");
                    this.suggestedViewHeight = "number" == typeof t ? t : "function" == typeof t ? t() : "number" == typeof e ? e - this.queryToolbarsHeight() : "function" == typeof e ? e() - this.queryToolbarsHeight() : "parent" === e ? this.el.parent().height() - this.queryToolbarsHeight() : Math.round(this.contentEl.width() / Math.max(this.opt("aspectRatio"), .5))
                }, t.prototype.windowResize = function (t) {
                    t.target === window && this.view && this.view.isDatesRendered && this.updateViewSize(!0) && this.publiclyTrigger("windowResize", [this.view])
                }, t.prototype.freezeContentHeight = function () {
                    this.freezeContentHeightDepth++ || this.forceFreezeContentHeight()
                }, t.prototype.forceFreezeContentHeight = function () {
                    this.contentEl.css({
                        width: "100%",
                        height: this.contentEl.height(),
                        overflow: "hidden"
                    })
                }, t.prototype.thawContentHeight = function () {
                    this.freezeContentHeightDepth--, this.contentEl.css({
                        width: "",
                        height: "",
                        overflow: ""
                    }), this.freezeContentHeightDepth && this.forceFreezeContentHeight()
                }, t.prototype.initToolbars = function () {
                    this.header = new p.default(this, this.computeHeaderOptions()), this.footer = new p.default(this, this.computeFooterOptions()), this.toolbarsManager = new l.default([this.header, this.footer])
                }, t.prototype.computeHeaderOptions = function () {
                    return {
                        extraClasses: "fc-header-toolbar",
                        layout: this.opt("header")
                    }
                }, t.prototype.computeFooterOptions = function () {
                    return {
                        extraClasses: "fc-footer-toolbar",
                        layout: this.opt("footer")
                    }
                }, t.prototype.renderHeader = function () {
                    var t = this.header;
                    t.setToolbarOptions(this.computeHeaderOptions()), t.render(), t.el && this.el.prepend(t.el)
                }, t.prototype.renderFooter = function () {
                    var t = this.footer;
                    t.setToolbarOptions(this.computeFooterOptions()), t.render(), t.el && this.el.append(t.el)
                }, t.prototype.setToolbarsTitle = function (t) {
                    this.toolbarsManager.proxyCall("updateTitle", t)
                }, t.prototype.updateToolbarButtons = function (t) {
                    var e = this.getNow(),
                        n = this.view,
                        r = n.dateProfileGenerator.build(e),
                        i = n.dateProfileGenerator.buildPrev(n.get("dateProfile")),
                        o = n.dateProfileGenerator.buildNext(n.get("dateProfile"));
                    this.toolbarsManager.proxyCall(r.isValid && !t.currentUnzonedRange.containsDate(e) ? "enableButton" : "disableButton", "today"), this.toolbarsManager.proxyCall(i.isValid ? "enableButton" : "disableButton", "prev"), this.toolbarsManager.proxyCall(o.isValid ? "enableButton" : "disableButton", "next")
                }, t.prototype.queryToolbarsHeight = function () {
                    return this.toolbarsManager.items.reduce(function (t, e) {
                        return t + (e.el ? e.el.outerHeight(!0) : 0)
                    }, 0)
                }, t.prototype.select = function (t, e) {
                    this.view.select(this.buildSelectFootprint.apply(this, arguments))
                }, t.prototype.unselect = function () {
                    this.view && this.view.unselect()
                }, t.prototype.buildSelectFootprint = function (t, e) {
                    var n, r = this.moment(t).stripZone();
                    return n = e ? this.moment(e).stripZone() : r.hasTime() ? r.clone().add(this.defaultTimedEventDuration) : r.clone().add(this.defaultAllDayEventDuration), new b.default(new m.default(r, n), !r.hasTime())
                }, t.prototype.initMomentInternals = function () {
                    var t = this;
                    this.defaultAllDayEventDuration = o.duration(this.opt("defaultAllDayEventDuration")), this.defaultTimedEventDuration = o.duration(this.opt("defaultTimedEventDuration")), this.optionsManager.watch("buildingMomentLocale", ["?locale", "?monthNames", "?monthNamesShort", "?dayNames", "?dayNamesShort", "?firstDay", "?weekNumberCalculation"], function (e) {
                        var n, r = e.weekNumberCalculation,
                            i = e.firstDay;
                        "iso" === r && (r = "ISO");
                        var o = Object.create(v.getMomentLocaleData(e.locale));
                        e.monthNames && (o._months = e.monthNames), e.monthNamesShort && (o._monthsShort = e.monthNamesShort), e.dayNames && (o._weekdays = e.dayNames), e.dayNamesShort && (o._weekdaysShort = e.dayNamesShort), null == i && "ISO" === r && (i = 1), null != i && (n = Object.create(o._week), n.dow = i, o._week = n), "ISO" !== r && "local" !== r && "function" != typeof r || (o._fullCalendar_weekCalc = r), t.localeData = o, t.currentDate && t.localizeMoment(t.currentDate)
                    })
                }, t.prototype.moment = function () {
                    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
                    var n;
                    return "local" === this.opt("timezone") ? (n = y.default.apply(null, t), n.hasTime() && n.local()) : n = "UTC" === this.opt("timezone") ? y.default.utc.apply(null, t) : y.default.parseZone.apply(null, t), this.localizeMoment(n), n
                }, t.prototype.msToMoment = function (t, e) {
                    var n = y.default.utc(t);
                    return e ? n.stripTime() : n = this.applyTimezone(n), this.localizeMoment(n), n
                }, t.prototype.msToUtcMoment = function (t, e) {
                    var n = y.default.utc(t);
                    return e && n.stripTime(), this.localizeMoment(n), n
                }, t.prototype.localizeMoment = function (t) {
                    t._locale = this.localeData
                }, t.prototype.getIsAmbigTimezone = function () {
                    return "local" !== this.opt("timezone") && "UTC" !== this.opt("timezone")
                }, t.prototype.applyTimezone = function (t) {
                    if (!t.hasTime()) return t.clone();
                    var e, n = this.moment(t.toArray()),
                        r = t.time().asMilliseconds() - n.time().asMilliseconds();
                    return r && (e = n.clone().add(r), t.time().asMilliseconds() - e.time().asMilliseconds() == 0 && (n = e)), n
                }, t.prototype.footprintToDateProfile = function (t, e) {
                    void 0 === e && (e = !1);
                    var n, r = y.default.utc(t.unzonedRange.startMs);
                    return e || (n = y.default.utc(t.unzonedRange.endMs)), t.isAllDay ? (r.stripTime(), n && n.stripTime()) : (r = this.applyTimezone(r), n && (n = this.applyTimezone(n))), this.localizeMoment(r), n && this.localizeMoment(n), new w.default(r, n, this)
                }, t.prototype.getNow = function () {
                    var t = this.opt("now");
                    return "function" == typeof t && (t = t()), this.moment(t).stripZone()
                }, t.prototype.humanizeDuration = function (t) {
                    return t.locale(this.opt("locale")).humanize()
                }, t.prototype.parseUnzonedRange = function (t) {
                    var e = null,
                        n = null;
                    return t.start && (e = this.moment(t.start).stripZone()), t.end && (n = this.moment(t.end).stripZone()), e || n ? e && n && n.isBefore(e) ? null : new m.default(e, n) : null
                }, t.prototype.initEventManager = function () {
                    var t = this,
                        e = new D.default(this),
                        n = this.opt("eventSources") || [],
                        r = this.opt("events");
                    this.eventManager = e, r && n.unshift(r), e.on("release", function (e) {
                        t.trigger("eventsReset", e)
                    }), e.freeze(), n.forEach(function (n) {
                        var r = S.default.parse(n, t);
                        r && e.addSource(r)
                    }), e.thaw()
                }, t.prototype.requestEvents = function (t, e) {
                    return this.eventManager.requestEvents(t, e, this.opt("timezone"), !this.opt("lazyFetching"))
                }, t.prototype.getEventEnd = function (t) {
                    return t.end ? t.end.clone() : this.getDefaultEventEnd(t.allDay, t.start)
                }, t.prototype.getDefaultEventEnd = function (t, e) {
                    var n = e.clone();
                    return t ? n.stripTime().add(this.defaultAllDayEventDuration) : n.add(this.defaultTimedEventDuration), this.getIsAmbigTimezone() && n.stripZone(), n
                }, t.prototype.rerenderEvents = function () {
                    this.view.flash("displayingEvents")
                }, t.prototype.refetchEvents = function () {
                    this.eventManager.refetchAllSources()
                }, t.prototype.renderEvents = function (t, e) {
                    this.eventManager.freeze();
                    for (var n = 0; n < t.length; n++) this.renderEvent(t[n], e);
                    this.eventManager.thaw()
                }, t.prototype.renderEvent = function (t, e) {
                    void 0 === e && (e = !1);
                    var n = this.eventManager,
                        r = C.default.parse(t, t.source || n.stickySource);
                    r && n.addEventDef(r, e)
                }, t.prototype.removeEvents = function (t) {
                    var e, n, i = this.eventManager,
                        o = [],
                        s = {};
                    if (null == t) i.removeAllEventDefs();
                    else {
                        for (i.getEventInstances().forEach(function (t) {
                                o.push(t.toLegacy())
                            }), o = r(o, t), n = 0; n < o.length; n++) e = this.eventManager.getEventDefByUid(o[n]._id), s[e.id] = !0;
                        i.freeze();
                        for (n in s) i.removeEventDefsById(n);
                        i.thaw()
                    }
                }, t.prototype.clientEvents = function (t) {
                    var e = [];
                    return this.eventManager.getEventInstances().forEach(function (t) {
                        e.push(t.toLegacy())
                    }), r(e, t)
                }, t.prototype.updateEvents = function (t) {
                    this.eventManager.freeze();
                    for (var e = 0; e < t.length; e++) this.updateEvent(t[e]);
                    this.eventManager.thaw()
                }, t.prototype.updateEvent = function (t) {
                    var e, n, r = this.eventManager.getEventDefByUid(t._id);
                    r instanceof R.default && (e = r.buildInstance(), n = T.default.createFromRawProps(e, t, null), this.eventManager.mutateEventsWithId(r.id, n))
                }, t.prototype.getEventSources = function () {
                    return this.eventManager.otherSources.slice()
                }, t.prototype.getEventSourceById = function (t) {
                    return this.eventManager.getSourceById(M.default.normalizeId(t))
                }, t.prototype.addEventSource = function (t) {
                    var e = S.default.parse(t, this);
                    e && this.eventManager.addSource(e)
                }, t.prototype.removeEventSources = function (t) {
                    var e, n, r = this.eventManager;
                    if (null == t) this.eventManager.removeAllSources();
                    else {
                        for (e = r.multiQuerySources(t), r.freeze(), n = 0; n < e.length; n++) r.removeSource(e[n]);
                        r.thaw()
                    }
                }, t.prototype.removeEventSource = function (t) {
                    var e, n = this.eventManager,
                        r = n.querySources(t);
                    for (n.freeze(), e = 0; e < r.length; e++) n.removeSource(r[e]);
                    n.thaw()
                }, t.prototype.refetchEventSources = function (t) {
                    var e, n = this.eventManager,
                        r = n.multiQuerySources(t);
                    for (n.freeze(), e = 0; e < r.length; e++) n.refetchSource(r[e]);
                    n.thaw()
                }, t.defaults = a.globalDefaults, t.englishDefaults = a.englishDefaults, t.rtlDefaults = a.rtlDefaults, t
            }();
        e.default = H, d.default.mixInto(H), c.default.mixInto(H)
    }, function (t, e, n) {
        function r(t) {
            var e, n, r, i, l = a.dataAttrPrefix;
            return l && (l += "-"), e = t.data(l + "event") || null, e && (e = "object" == typeof e ? o.extend({}, e) : {}, n = e.start, null == n && (n = e.time), r = e.duration, i = e.stick, delete e.start, delete e.time, delete e.duration, delete e.stick), null == n && (n = t.data(l + "start")), null == n && (n = t.data(l + "time")), null == r && (r = t.data(l + "duration")), null == i && (i = t.data(l + "stick")), n = null != n ? s.duration(n) : null, r = null != r ? s.duration(r) : null, i = Boolean(i), {
                eventProps: e,
                startTime: n,
                duration: r,
                stick: i
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i = n(2),
            o = n(3),
            s = n(0),
            a = n(18),
            l = n(4),
            u = n(11),
            d = n(7),
            c = n(17),
            p = n(9),
            h = n(20),
            f = n(6),
            g = n(14),
            v = function (t) {
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    return e.isDragging = !1, e
                }
                return i.__extends(e, t), e.prototype.end = function () {
                    this.dragListener && this.dragListener.endInteraction()
                }, e.prototype.bindToDocument = function () {
                    this.listenTo(o(document), {
                        dragstart: this.handleDragStart,
                        sortstart: this.handleDragStart
                    })
                }, e.prototype.unbindFromDocument = function () {
                    this.stopListeningTo(o(document))
                }, e.prototype.handleDragStart = function (t, e) {
                    var n, r;
                    this.opt("droppable") && (n = o((e ? e.item : null) || t.target), r = this.opt("dropAccept"), (o.isFunction(r) ? r.call(n[0], n) : n.is(r)) && (this.isDragging || this.listenToExternalDrag(n, t, e)))
                }, e.prototype.listenToExternalDrag = function (t, e, n) {
                    var i, o = this,
                        s = this.component,
                        a = this.view,
                        u = r(t);
                    (this.dragListener = new c.default(s, {
                        interactionStart: function () {
                            o.isDragging = !0
                        },
                        hitOver: function (t) {
                            var e, n = !0,
                                r = t.component.getSafeHitFootprint(t);
                            r ? (i = o.computeExternalDrop(r, u), i ? (e = new h.default(i.buildInstances()), n = u.eventProps ? s.isEventInstanceGroupAllowed(e) : s.isExternalInstanceGroupAllowed(e)) : n = !1) : n = !1, n || (i = null, l.disableCursor()), i && s.renderDrag(s.eventRangesToEventFootprints(e.sliceRenderRanges(s.dateProfile.renderUnzonedRange, a.calendar)))
                        },
                        hitOut: function () {
                            i = null
                        },
                        hitDone: function () {
                            l.enableCursor(), s.unrenderDrag()
                        },
                        interactionEnd: function (e) {
                            i && a.reportExternalDrop(i, Boolean(u.eventProps), Boolean(u.stick), t, e, n), o.isDragging = !1, o.dragListener = null
                        }
                    })).startDrag(e)
                }, e.prototype.computeExternalDrop = function (t, e) {
                    var n, r = this.view.calendar,
                        i = u.default.utc(t.unzonedRange.startMs).stripZone();
                    return t.isAllDay && (e.startTime ? i.time(e.startTime) : i.stripTime()), e.duration && (n = i.clone().add(e.duration)), i = r.applyTimezone(i), n && (n = r.applyTimezone(n)), p.default.parse(o.extend({}, e.eventProps, {
                        start: i,
                        end: n
                    }), new f.default(r))
                }, e
            }(g.default);
        e.default = v, d.default.mixInto(v), a.dataAttrPrefix = ""
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(4),
            s = n(39),
            a = n(40),
            l = n(17),
            u = n(14),
            d = function (t) {
                function e(e, n) {
                    var r = t.call(this, e) || this;
                    return r.isResizing = !1, r.eventPointing = n, r
                }
                return r.__extends(e, t), e.prototype.end = function () {
                    this.dragListener && this.dragListener.endInteraction()
                }, e.prototype.bindToEl = function (t) {
                    var e = this.component;
                    e.bindSegHandlerToEl(t, "mousedown", this.handleMouseDown.bind(this)), e.bindSegHandlerToEl(t, "touchstart", this.handleTouchStart.bind(this))
                }, e.prototype.handleMouseDown = function (t, e) {
                    this.component.canStartResize(t, e) && this.buildDragListener(t, i(e.target).is(".fc-start-resizer")).startInteraction(e, {
                        distance: 5
                    })
                }, e.prototype.handleTouchStart = function (t, e) {
                    this.component.canStartResize(t, e) && this.buildDragListener(t, i(e.target).is(".fc-start-resizer")).startInteraction(e)
                }, e.prototype.buildDragListener = function (t, e) {
                    var n, r, i = this,
                        s = this.component,
                        a = this.view,
                        u = a.calendar,
                        d = u.eventManager,
                        c = t.el,
                        p = t.footprint.eventDef,
                        h = t.footprint.eventInstance;
                    return this.dragListener = new l.default(s, {
                        scroll: this.opt("dragScroll"),
                        subjectEl: c,
                        interactionStart: function () {
                            n = !1
                        },
                        dragStart: function (e) {
                            n = !0, i.eventPointing.handleMouseout(t, e), i.segResizeStart(t, e)
                        },
                        hitOver: function (n, l, c) {
                            var h, f = !0,
                                g = s.getSafeHitFootprint(c),
                                v = s.getSafeHitFootprint(n);
                            g && v ? (r = e ? i.computeEventStartResizeMutation(g, v, t.footprint) : i.computeEventEndResizeMutation(g, v, t.footprint), r ? (h = d.buildMutatedEventInstanceGroup(p.id, r), f = s.isEventInstanceGroupAllowed(h)) : f = !1) : f = !1, f ? r.isEmpty() && (r = null) : (r = null, o.disableCursor()), r && (a.hideEventsWithId(t.footprint.eventDef.id), a.renderEventResize(s.eventRangesToEventFootprints(h.sliceRenderRanges(s.dateProfile.renderUnzonedRange, u)), t))
                        },
                        hitOut: function () {
                            r = null
                        },
                        hitDone: function () {
                            a.unrenderEventResize(t), a.showEventsWithId(t.footprint.eventDef.id), o.enableCursor()
                        },
                        interactionEnd: function (e) {
                            n && i.segResizeStop(t, e), r && a.reportEventResize(h, r, c, e), i.dragListener = null
                        }
                    })
                }, e.prototype.segResizeStart = function (t, e) {
                    this.isResizing = !0, this.component.publiclyTrigger("eventResizeStart", {
                        context: t.el[0],
                        args: [t.footprint.getEventLegacy(), e, {}, this.view]
                    })
                }, e.prototype.segResizeStop = function (t, e) {
                    this.isResizing = !1, this.component.publiclyTrigger("eventResizeStop", {
                        context: t.el[0],
                        args: [t.footprint.getEventLegacy(), e, {}, this.view]
                    })
                }, e.prototype.computeEventStartResizeMutation = function (t, e, n) {
                    var r, i, o = n.componentFootprint.unzonedRange,
                        l = this.component.diffDates(e.unzonedRange.getStart(), t.unzonedRange.getStart());
                    return o.getStart().add(l) < o.getEnd() && (r = new a.default, r.setStartDelta(l), i = new s.default, i.setDateMutation(r), i)
                }, e.prototype.computeEventEndResizeMutation = function (t, e, n) {
                    var r, i, o = n.componentFootprint.unzonedRange,
                        l = this.component.diffDates(e.unzonedRange.getEnd(), t.unzonedRange.getEnd());
                    return o.getEnd().add(l) > o.getStart() && (r = new a.default, r.setEndDelta(l), i = new s.default, i.setDateMutation(r), i)
                }, e
            }(u.default);
        e.default = d
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(4),
            o = n(39),
            s = n(40),
            a = n(59),
            l = n(17),
            u = n(226),
            d = n(14),
            c = function (t) {
                function e(e, n) {
                    var r = t.call(this, e) || this;
                    return r.isDragging = !1, r.eventPointing = n, r
                }
                return r.__extends(e, t), e.prototype.end = function () {
                    this.dragListener && this.dragListener.endInteraction()
                }, e.prototype.getSelectionDelay = function () {
                    var t = this.opt("eventLongPressDelay");
                    return null == t && (t = this.opt("longPressDelay")), t
                }, e.prototype.bindToEl = function (t) {
                    var e = this.component;
                    e.bindSegHandlerToEl(t, "mousedown", this.handleMousedown.bind(this)), e.bindSegHandlerToEl(t, "touchstart", this.handleTouchStart.bind(this))
                }, e.prototype.handleMousedown = function (t, e) {
                    !this.component.shouldIgnoreMouse() && this.component.canStartDrag(t, e) && this.buildDragListener(t).startInteraction(e, {
                        distance: 5
                    })
                }, e.prototype.handleTouchStart = function (t, e) {
                    var n = this.component,
                        r = {
                            delay: this.view.isEventDefSelected(t.footprint.eventDef) ? 0 : this.getSelectionDelay()
                        };
                    n.canStartDrag(t, e) ? this.buildDragListener(t).startInteraction(e, r) : n.canStartSelection(t, e) && this.buildSelectListener(t).startInteraction(e, r)
                }, e.prototype.buildSelectListener = function (t) {
                    var e = this,
                        n = this.view,
                        r = t.footprint.eventDef,
                        i = t.footprint.eventInstance;
                    if (this.dragListener) return this.dragListener;
                    var o = this.dragListener = new a.default({
                        dragStart: function (t) {
                            o.isTouch && !n.isEventDefSelected(r) && i && n.selectEventInstance(i)
                        },
                        interactionEnd: function (t) {
                            e.dragListener = null
                        }
                    });
                    return o
                }, e.prototype.buildDragListener = function (t) {
                    var e, n, r, o = this,
                        s = this.component,
                        a = this.view,
                        d = a.calendar,
                        c = d.eventManager,
                        p = t.el,
                        h = t.footprint.eventDef,
                        f = t.footprint.eventInstance;
                    if (this.dragListener) return this.dragListener;
                    var g = this.dragListener = new l.default(a, {
                        scroll: this.opt("dragScroll"),
                        subjectEl: p,
                        subjectCenter: !0,
                        interactionStart: function (r) {
                            t.component = s, e = !1, n = new u.default(t.el, {
                                additionalClass: "fc-dragging",
                                parentEl: a.el,
                                opacity: g.isTouch ? null : o.opt("dragOpacity"),
                                revertDuration: o.opt("dragRevertDuration"),
                                zIndex: 2
                            }), n.hide(), n.start(r)
                        },
                        dragStart: function (n) {
                            g.isTouch && !a.isEventDefSelected(h) && f && a.selectEventInstance(f), e = !0, o.eventPointing.handleMouseout(t, n), o.segDragStart(t, n), a.hideEventsWithId(t.footprint.eventDef.id)
                        },
                        hitOver: function (e, l, u) {
                            var p, f, v, y = !0;
                            t.hit && (u = t.hit), p = u.component.getSafeHitFootprint(u), f = e.component.getSafeHitFootprint(e), p && f ? (r = o.computeEventDropMutation(p, f, h), r ? (v = c.buildMutatedEventInstanceGroup(h.id, r), y = s.isEventInstanceGroupAllowed(v)) : y = !1) : y = !1, y || (r = null, i.disableCursor()), r && a.renderDrag(s.eventRangesToEventFootprints(v.sliceRenderRanges(s.dateProfile.renderUnzonedRange, d)), t, g.isTouch) ? n.hide() : n.show(), l && (r = null)
                        },
                        hitOut: function () {
                            a.unrenderDrag(t), n.show(), r = null
                        },
                        hitDone: function () {
                            i.enableCursor()
                        },
                        interactionEnd: function (i) {
                            delete t.component, n.stop(!r, function () {
                                e && (a.unrenderDrag(t), o.segDragStop(t, i)), a.showEventsWithId(t.footprint.eventDef.id), r && a.reportEventDrop(f, r, p, i)
                            }), o.dragListener = null
                        }
                    });
                    return g
                }, e.prototype.segDragStart = function (t, e) {
                    this.isDragging = !0, this.component.publiclyTrigger("eventDragStart", {
                        context: t.el[0],
                        args: [t.footprint.getEventLegacy(), e, {}, this.view]
                    })
                }, e.prototype.segDragStop = function (t, e) {
                    this.isDragging = !1, this.component.publiclyTrigger("eventDragStop", {
                        context: t.el[0],
                        args: [t.footprint.getEventLegacy(), e, {}, this.view]
                    })
                }, e.prototype.computeEventDropMutation = function (t, e, n) {
                    var r = new o.default;
                    return r.setDateMutation(this.computeEventDateMutation(t, e)), r
                }, e.prototype.computeEventDateMutation = function (t, e) {
                    var n, r, i = t.unzonedRange.getStart(),
                        o = e.unzonedRange.getStart(),
                        a = !1,
                        l = !1,
                        u = !1;
                    return t.isAllDay !== e.isAllDay && (a = !0, e.isAllDay ? (u = !0, i.stripTime()) : l = !0), n = this.component.diffDates(o, i), r = new s.default, r.clearEnd = a, r.forceTimed = l, r.forceAllDay = u, r.setDateDelta(n), r
                }, e
            }(d.default);
        e.default = c
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(4),
            o = n(17),
            s = n(12),
            a = n(5),
            l = n(14),
            u = function (t) {
                function e(e) {
                    var n = t.call(this, e) || this;
                    return n.dragListener = n.buildDragListener(), n
                }
                return r.__extends(e, t), e.prototype.end = function () {
                    this.dragListener.endInteraction()
                }, e.prototype.getDelay = function () {
                    var t = this.opt("selectLongPressDelay");
                    return null == t && (t = this.opt("longPressDelay")), t
                }, e.prototype.bindToEl = function (t) {
                    var e = this,
                        n = this.component,
                        r = this.dragListener;
                    n.bindDateHandlerToEl(t, "mousedown", function (t) {
                        e.opt("selectable") && !n.shouldIgnoreMouse() && r.startInteraction(t, {
                            distance: e.opt("selectMinDistance")
                        })
                    }), n.bindDateHandlerToEl(t, "touchstart", function (t) {
                        e.opt("selectable") && !n.shouldIgnoreTouch() && r.startInteraction(t, {
                            delay: e.getDelay()
                        })
                    }), i.preventSelection(t)
                }, e.prototype.buildDragListener = function () {
                    var t, e = this,
                        n = this.component;
                    return new o.default(n, {
                        scroll: this.opt("dragScroll"),
                        interactionStart: function () {
                            t = null
                        },
                        dragStart: function (t) {
                            e.view.unselect(t)
                        },
                        hitOver: function (r, o, s) {
                            var a, l;
                            s && (a = n.getSafeHitFootprint(s), l = n.getSafeHitFootprint(r), t = a && l ? e.computeSelection(a, l) : null, t ? n.renderSelectionFootprint(t) : !1 === t && i.disableCursor())
                        },
                        hitOut: function () {
                            t = null, n.unrenderSelection()
                        },
                        hitDone: function () {
                            i.enableCursor()
                        },
                        interactionEnd: function (n, r) {
                            !r && t && e.view.reportSelection(t, n)
                        }
                    })
                }, e.prototype.computeSelection = function (t, e) {
                    var n = this.computeSelectionFootprint(t, e);
                    return !(n && !this.isSelectionFootprintAllowed(n)) && n
                }, e.prototype.computeSelectionFootprint = function (t, e) {
                    var n = [t.unzonedRange.startMs, t.unzonedRange.endMs, e.unzonedRange.startMs, e.unzonedRange.endMs];
                    return n.sort(i.compareNumbers), new s.default(new a.default(n[0], n[3]), t.isAllDay)
                }, e.prototype.isSelectionFootprintAllowed = function (t) {
                    return this.component.dateProfile.validUnzonedRange.containsRange(t.unzonedRange) && this.view.calendar.constraints.isSelectionFootprintAllowed(t)
                }, e
            }(l.default);
        e.default = u
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(17),
            o = n(14),
            s = function (t) {
                function e(e) {
                    var n = t.call(this, e) || this;
                    return n.dragListener = n.buildDragListener(), n
                }
                return r.__extends(e, t), e.prototype.end = function () {
                    this.dragListener.endInteraction()
                }, e.prototype.bindToEl = function (t) {
                    var e = this.component,
                        n = this.dragListener;
                    e.bindDateHandlerToEl(t, "mousedown", function (t) {
                        e.shouldIgnoreMouse() || n.startInteraction(t)
                    }), e.bindDateHandlerToEl(t, "touchstart", function (t) {
                        e.shouldIgnoreTouch() || n.startInteraction(t)
                    })
                }, e.prototype.buildDragListener = function () {
                    var t, e = this,
                        n = this.component,
                        r = new i.default(n, {
                            scroll: this.opt("dragScroll"),
                            interactionStart: function () {
                                t = r.origHit
                            },
                            hitOver: function (e, n, r) {
                                n || (t = null)
                            },
                            hitOut: function () {
                                t = null
                            },
                            interactionEnd: function (r, i) {
                                var o;
                                !i && t && (o = n.getSafeHitFootprint(t)) && e.view.triggerDayClick(o, n.getHitEl(t), r)
                            }
                        });
                    return r.shouldCancelTouchScroll = !1, r.scrollAlwaysKills = !0, r
                }, e
            }(o.default);
        e.default = s
    }, function (t, e, n) {
        function r(t) {
            var e, n = [],
                r = [];
            for (e = 0; e < t.length; e++) t[e].componentFootprint.isAllDay ? n.push(t[e]) : r.push(t[e]);
            return {
                allDay: n,
                timed: r
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var i, o, s = n(2),
            a = n(0),
            l = n(3),
            u = n(4),
            d = n(41),
            c = n(43),
            p = n(239),
            h = n(66),
            f = function (t) {
                function e(e, n) {
                    var r = t.call(this, e, n) || this;
                    return r.usesMinMaxTime = !0, r.timeGrid = r.instantiateTimeGrid(), r.addChild(r.timeGrid), r.opt("allDaySlot") && (r.dayGrid = r.instantiateDayGrid(), r.addChild(r.dayGrid)), r.scroller = new d.default({
                        overflowX: "hidden",
                        overflowY: "auto"
                    }), r
                }
                return s.__extends(e, t), e.prototype.instantiateTimeGrid = function () {
                    var t = new this.timeGridClass(this);
                    return u.copyOwnProps(i, t), t
                }, e.prototype.instantiateDayGrid = function () {
                    var t = new this.dayGridClass(this);
                    return u.copyOwnProps(o, t), t
                }, e.prototype.renderSkeleton = function () {
                    var t, e;
                    this.el.addClass("fc-agenda-view").html(this.renderSkeletonHtml()), this.scroller.render(), t = this.scroller.el.addClass("fc-time-grid-container"), e = l('<div class="fc-time-grid">').appendTo(t), this.el.find(".fc-body > tr > td").append(t), this.timeGrid.headContainerEl = this.el.find(".fc-head-container"), this.timeGrid.setElement(e), this.dayGrid && (this.dayGrid.setElement(this.el.find(".fc-day-grid")), this.dayGrid.bottomCoordPadding = this.dayGrid.el.next("hr").outerHeight())
                }, e.prototype.unrenderSkeleton = function () {
                    this.timeGrid.removeElement(), this.dayGrid && this.dayGrid.removeElement(), this.scroller.destroy()
                }, e.prototype.renderSkeletonHtml = function () {
                    var t = this.calendar.theme;
                    return '<table class="' + t.getClass("tableGrid") + '">' + (this.opt("columnHeader") ? '<thead class="fc-head"><tr><td class="fc-head-container ' + t.getClass("widgetHeader") + '">&nbsp;</td></tr></thead>' : "") + '<tbody class="fc-body"><tr><td class="' + t.getClass("widgetContent") + '">' + (this.dayGrid ? '<div class="fc-day-grid"></div><hr class="fc-divider ' + t.getClass("widgetHeader") + '"></hr>' : "") + "</td></tr></tbody></table>"
                }, e.prototype.axisStyleAttr = function () {
                    return null != this.axisWidth ? 'style="width:' + this.axisWidth + 'px"' : ""
                }, e.prototype.getNowIndicatorUnit = function () {
                    return this.timeGrid.getNowIndicatorUnit()
                }, e.prototype.updateSize = function (e, n, r) {
                    var i, o, s;
                    if (t.prototype.updateSize.call(this, e, n, r), this.axisWidth = u.matchCellWidths(this.el.find(".fc-axis")), !this.timeGrid.colEls) return void(n || (o = this.computeScrollerHeight(e), this.scroller.setHeight(o)));
                    var a = this.el.find(".fc-row:not(.fc-scroller *)");
                    this.timeGrid.bottomRuleEl.hide(), this.scroller.clear(), u.uncompensateScroll(a), this.dayGrid && (this.dayGrid.removeSegPopover(), i = this.opt("eventLimit"), i && "number" != typeof i && (i = 5), i && this.dayGrid.limitRows(i)), n || (o = this.computeScrollerHeight(e), this.scroller.setHeight(o), s = this.scroller.getScrollbarWidths(), (s.left || s.right) && (u.compensateScroll(a, s), o = this.computeScrollerHeight(e), this.scroller.setHeight(o)), this.scroller.lockOverflow(s), this.timeGrid.getTotalSlatHeight() < o && this.timeGrid.bottomRuleEl.show())
                }, e.prototype.computeScrollerHeight = function (t) {
                    return t - u.subtractInnerElHeight(this.el, this.scroller.el)
                }, e.prototype.computeInitialDateScroll = function () {
                    var t = a.duration(this.opt("scrollTime")),
                        e = this.timeGrid.computeTimeTop(t);
                    return e = Math.ceil(e), e && e++, {
                        top: e
                    }
                }, e.prototype.queryDateScroll = function () {
                    return {
                        top: this.scroller.getScrollTop()
                    }
                }, e.prototype.applyDateScroll = function (t) {
                    void 0 !== t.top && this.scroller.setScrollTop(t.top)
                }, e.prototype.getHitFootprint = function (t) {
                    return t.component.getHitFootprint(t)
                }, e.prototype.getHitEl = function (t) {
                    return t.component.getHitEl(t)
                }, e.prototype.executeEventRender = function (t) {
                    var e, n, r = {},
                        i = {};
                    for (e in t) n = t[e], n.getEventDef().isAllDay() ? r[e] = n : i[e] = n;
                    this.timeGrid.executeEventRender(i), this.dayGrid && this.dayGrid.executeEventRender(r)
                }, e.prototype.renderDrag = function (t, e, n) {
                    var i = r(t),
                        o = !1;
                    return o = this.timeGrid.renderDrag(i.timed, e, n), this.dayGrid && (o = this.dayGrid.renderDrag(i.allDay, e, n) || o), o
                }, e.prototype.renderEventResize = function (t, e, n) {
                    var i = r(t);
                    this.timeGrid.renderEventResize(i.timed, e, n), this.dayGrid && this.dayGrid.renderEventResize(i.allDay, e, n)
                }, e.prototype.renderSelectionFootprint = function (t) {
                    t.isAllDay ? this.dayGrid && this.dayGrid.renderSelectionFootprint(t) : this.timeGrid.renderSelectionFootprint(t)
                }, e
            }(c.default);
        e.default = f, f.prototype.timeGridClass = p.default, f.prototype.dayGridClass = h.default, i = {
            renderHeadIntroHtml: function () {
                var t, e = this.view,
                    n = e.calendar,
                    r = n.msToUtcMoment(this.dateProfile.renderUnzonedRange.startMs, !0);
                return this.opt("weekNumbers") ? (t = r.format(this.opt("smallWeekFormat")), '<th class="fc-axis fc-week-number ' + n.theme.getClass("widgetHeader") + '" ' + e.axisStyleAttr() + ">" + e.buildGotoAnchorHtml({
                    date: r,
                    type: "week",
                    forceOff: this.colCnt > 1
                }, u.htmlEscape(t)) + "</th>") : '<th class="fc-axis ' + n.theme.getClass("widgetHeader") + '" ' + e.axisStyleAttr() + "></th>"
            },
            renderBgIntroHtml: function () {
                var t = this.view;
                return '<td class="fc-axis ' + t.calendar.theme.getClass("widgetContent") + '" ' + t.axisStyleAttr() + "></td>"
            },
            renderIntroHtml: function () {
                return '<td class="fc-axis" ' + this.view.axisStyleAttr() + "></td>"
            }
        }, o = {
            renderBgIntroHtml: function () {
                var t = this.view;
                return '<td class="fc-axis ' + t.calendar.theme.getClass("widgetContent") + '" ' + t.axisStyleAttr() + "><span>" + t.getAllDayHtml() + "</span></td>"
            },
            renderIntroHtml: function () {
                return '<td class="fc-axis" ' + this.view.axisStyleAttr() + "></td>"
            }
        }
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(0),
            s = n(4),
            a = n(42),
            l = n(61),
            u = n(65),
            d = n(60),
            c = n(58),
            p = n(5),
            h = n(12),
            f = n(240),
            g = n(241),
            v = n(242),
            y = [{
                hours: 1
            }, {
                minutes: 30
            }, {
                minutes: 15
            }, {
                seconds: 30
            }, {
                seconds: 15
            }],
            m = function (t) {
                function e(e) {
                    var n = t.call(this, e) || this;
                    return n.processOptions(), n
                }
                return r.__extends(e, t), e.prototype.componentFootprintToSegs = function (t) {
                    var e, n = this.sliceRangeByTimes(t.unzonedRange);
                    for (e = 0; e < n.length; e++) this.isRTL ? n[e].col = this.daysPerRow - 1 - n[e].dayIndex : n[e].col = n[e].dayIndex;
                    return n
                }, e.prototype.sliceRangeByTimes = function (t) {
                    var e, n, r = [];
                    for (n = 0; n < this.daysPerRow; n++)(e = t.intersect(this.dayRanges[n])) && r.push({
                        startMs: e.startMs,
                        endMs: e.endMs,
                        isStart: e.isStart,
                        isEnd: e.isEnd,
                        dayIndex: n
                    });
                    return r
                }, e.prototype.processOptions = function () {
                    var t, e = this.opt("slotDuration"),
                        n = this.opt("snapDuration");
                    e = o.duration(e), n = n ? o.duration(n) : e, this.slotDuration = e, this.snapDuration = n, this.snapsPerSlot = e / n, t = this.opt("slotLabelFormat"), i.isArray(t) && (t = t[t.length - 1]), this.labelFormat = t || this.opt("smallTimeFormat"), t = this.opt("slotLabelInterval"), this.labelInterval = t ? o.duration(t) : this.computeLabelInterval(e)
                }, e.prototype.computeLabelInterval = function (t) {
                    var e, n, r;
                    for (e = y.length - 1; e >= 0; e--)
                        if (n = o.duration(y[e]), r = s.divideDurationByDuration(n, t), s.isInt(r) && r > 1) return n;
                    return o.duration(t)
                }, e.prototype.renderDates = function (t) {
                    this.dateProfile = t, this.updateDayTable(), this.renderSlats(), this.renderColumns()
                }, e.prototype.unrenderDates = function () {
                    this.unrenderColumns()
                }, e.prototype.renderSkeleton = function () {
                    var t = this.view.calendar.theme;
                    this.el.html('<div class="fc-bg"></div><div class="fc-slats"></div><hr class="fc-divider ' + t.getClass("widgetHeader") + '" style="display:none"></hr>'), this.bottomRuleEl = this.el.find("hr")
                }, e.prototype.renderSlats = function () {
                    var t = this.view.calendar.theme;
                    this.slatContainerEl = this.el.find("> .fc-slats").html('<table class="' + t.getClass("tableGrid") + '">' + this.renderSlatRowHtml() + "</table>"), this.slatEls = this.slatContainerEl.find("tr"), this.slatCoordCache = new c.default({
                        els: this.slatEls,
                        isVertical: !0
                    })
                }, e.prototype.renderSlatRowHtml = function () {
                    for (var t, e, n, r = this.view, i = r.calendar, a = i.theme, l = this.isRTL, u = this.dateProfile, d = "", c = o.duration(+u.minTime), p = o.duration(0); c < u.maxTime;) t = i.msToUtcMoment(u.renderUnzonedRange.startMs).time(c), e = s.isInt(s.divideDurationByDuration(p, this.labelInterval)), n = '<td class="fc-axis fc-time ' + a.getClass("widgetContent") + '" ' + r.axisStyleAttr() + ">" + (e ? "<span>" + s.htmlEscape(t.format(this.labelFormat)) + "</span>" : "") + "</td>", d += '<tr data-time="' + t.format("HH:mm:ss") + '"' + (e ? "" : ' class="fc-minor"') + ">" + (l ? "" : n) + '<td class="' + a.getClass("widgetContent") + '"></td>' + (l ? n : "") + "</tr>", c.add(this.slotDuration), p.add(this.slotDuration);
                    return d
                }, e.prototype.renderColumns = function () {
                    var t = this.dateProfile,
                        e = this.view.calendar.theme;
                    this.dayRanges = this.dayDates.map(function (e) {
                        return new p.default(e.clone().add(t.minTime), e.clone().add(t.maxTime))
                    }), this.headContainerEl && this.headContainerEl.html(this.renderHeadHtml()), this.el.find("> .fc-bg").html('<table class="' + e.getClass("tableGrid") + '">' + this.renderBgTrHtml(0) + "</table>"), this.colEls = this.el.find(".fc-day, .fc-disabled-day"), this.colCoordCache = new c.default({
                        els: this.colEls,
                        isHorizontal: !0
                    }), this.renderContentSkeleton()
                }, e.prototype.unrenderColumns = function () {
                    this.unrenderContentSkeleton()
                }, e.prototype.renderContentSkeleton = function () {
                    var t, e, n = "";
                    for (t = 0; t < this.colCnt; t++) n += '<td><div class="fc-content-col"><div class="fc-event-container fc-helper-container"></div><div class="fc-event-container"></div><div class="fc-highlight-container"></div><div class="fc-bgevent-container"></div><div class="fc-business-container"></div></div></td>';
                    e = this.contentSkeletonEl = i('<div class="fc-content-skeleton"><table><tr>' + n + "</tr></table></div>"), this.colContainerEls = e.find(".fc-content-col"), this.helperContainerEls = e.find(".fc-helper-container"), this.fgContainerEls = e.find(".fc-event-container:not(.fc-helper-container)"), this.bgContainerEls = e.find(".fc-bgevent-container"), this.highlightContainerEls = e.find(".fc-highlight-container"), this.businessContainerEls = e.find(".fc-business-container"), this.bookendCells(e.find("tr")), this.el.append(e)
                }, e.prototype.unrenderContentSkeleton = function () {
                    this.contentSkeletonEl && (this.contentSkeletonEl.remove(), this.contentSkeletonEl = null, this.colContainerEls = null, this.helperContainerEls = null, this.fgContainerEls = null, this.bgContainerEls = null, this.highlightContainerEls = null, this.businessContainerEls = null)
                }, e.prototype.groupSegsByCol = function (t) {
                    var e, n = [];
                    for (e = 0; e < this.colCnt; e++) n.push([]);
                    for (e = 0; e < t.length; e++) n[t[e].col].push(t[e]);
                    return n
                }, e.prototype.attachSegsByCol = function (t, e) {
                    var n, r, i;
                    for (n = 0; n < this.colCnt; n++)
                        for (r = t[n], i = 0; i < r.length; i++) e.eq(n).append(r[i].el)
                }, e.prototype.getNowIndicatorUnit = function () {
                    return "minute"
                }, e.prototype.renderNowIndicator = function (t) {
                    if (this.colContainerEls) {
                        var e, n = this.componentFootprintToSegs(new h.default(new p.default(t, t.valueOf() + 1), !1)),
                            r = this.computeDateTop(t, t),
                            o = [];
                        for (e = 0; e < n.length; e++) o.push(i('<div class="fc-now-indicator fc-now-indicator-line"></div>').css("top", r).appendTo(this.colContainerEls.eq(n[e].col))[0]);
                        n.length > 0 && o.push(i('<div class="fc-now-indicator fc-now-indicator-arrow"></div>').css("top", r).appendTo(this.el.find(".fc-content-skeleton"))[0]), this.nowIndicatorEls = i(o)
                    }
                }, e.prototype.unrenderNowIndicator = function () {
                    this.nowIndicatorEls && (this.nowIndicatorEls.remove(), this.nowIndicatorEls = null)
                }, e.prototype.updateSize = function (e, n, r) {
                    t.prototype.updateSize.call(this, e, n, r), this.slatCoordCache.build(), r && this.updateSegVerticals([].concat(this.eventRenderer.getSegs(), this.businessSegs || []))
                }, e.prototype.getTotalSlatHeight = function () {
                    return this.slatContainerEl.outerHeight()
                }, e.prototype.computeDateTop = function (t, e) {
                    return this.computeTimeTop(o.duration(t - e.clone().stripTime()))
                }, e.prototype.computeTimeTop = function (t) {
                    var e, n, r = this.slatEls.length,
                        i = this.dateProfile,
                        o = (t - i.minTime) / this.slotDuration;
                    return o = Math.max(0, o), o = Math.min(r, o), e = Math.floor(o), e = Math.min(e, r - 1), n = o - e, this.slatCoordCache.getTopPosition(e) + this.slatCoordCache.getHeight(e) * n
                }, e.prototype.updateSegVerticals = function (t) {
                    this.computeSegVerticals(t), this.assignSegVerticals(t)
                }, e.prototype.computeSegVerticals = function (t) {
                    var e, n, r, i = this.opt("agendaEventMinHeight");
                    for (e = 0; e < t.length; e++) n = t[e], r = this.dayDates[n.dayIndex], n.top = this.computeDateTop(n.startMs, r), n.bottom = Math.max(n.top + i, this.computeDateTop(n.endMs, r))
                }, e.prototype.assignSegVerticals = function (t) {
                    var e, n;
                    for (e = 0; e < t.length; e++) n = t[e], n.el.css(this.generateSegVerticalCss(n))
                }, e.prototype.generateSegVerticalCss = function (t) {
                    return {
                        top: t.top,
                        bottom: -t.bottom
                    }
                }, e.prototype.prepareHits = function () {
                    this.colCoordCache.build(), this.slatCoordCache.build()
                }, e.prototype.releaseHits = function () {
                    this.colCoordCache.clear()
                }, e.prototype.queryHit = function (t, e) {
                    var n = this.snapsPerSlot,
                        r = this.colCoordCache,
                        i = this.slatCoordCache;
                    if (r.isLeftInBounds(t) && i.isTopInBounds(e)) {
                        var o = r.getHorizontalIndex(t),
                            s = i.getVerticalIndex(e);
                        if (null != o && null != s) {
                            var a = i.getTopOffset(s),
                                l = i.getHeight(s),
                                u = (e - a) / l,
                                d = Math.floor(u * n),
                                c = s * n + d,
                                p = a + d / n * l,
                                h = a + (d + 1) / n * l;
                            return {
                                col: o,
                                snap: c,
                                component: this,
                                left: r.getLeftOffset(o),
                                right: r.getRightOffset(o),
                                top: p,
                                bottom: h
                            }
                        }
                    }
                }, e.prototype.getHitFootprint = function (t) {
                    var e, n = this.getCellDate(0, t.col),
                        r = this.computeSnapTime(t.snap);
                    return n.time(r), e = n.clone().add(this.snapDuration), new h.default(new p.default(n, e), !1)
                }, e.prototype.computeSnapTime = function (t) {
                    return o.duration(this.dateProfile.minTime + this.snapDuration * t)
                }, e.prototype.getHitEl = function (t) {
                    return this.colEls.eq(t.col)
                }, e.prototype.renderDrag = function (t, e, n) {
                    var r;
                    if (e) {
                        if (t.length) return this.helperRenderer.renderEventDraggingFootprints(t, e, n), !0
                    } else
                        for (r = 0; r < t.length; r++) this.renderHighlight(t[r].componentFootprint)
                }, e.prototype.unrenderDrag = function () {
                    this.unrenderHighlight(), this.helperRenderer.unrender()
                }, e.prototype.renderEventResize = function (t, e, n) {
                    this.helperRenderer.renderEventResizingFootprints(t, e, n)
                }, e.prototype.unrenderEventResize = function () {
                    this.helperRenderer.unrender()
                }, e.prototype.renderSelectionFootprint = function (t) {
                    this.opt("selectHelper") ? this.helperRenderer.renderComponentFootprint(t) : this.renderHighlight(t)
                }, e.prototype.unrenderSelection = function () {
                    this.helperRenderer.unrender(), this.unrenderHighlight()
                }, e
            }(a.default);
        e.default = m, m.prototype.eventRendererClass = f.default, m.prototype.businessHourRendererClass = l.default, m.prototype.helperRendererClass = g.default, m.prototype.fillRendererClass = v.default, u.default.mixInto(m), d.default.mixInto(m)
    }, function (t, e, n) {
        function r(t) {
            var e, n, r, i = [];
            for (e = 0; e < t.length; e++) {
                for (n = t[e], r = 0; r < i.length && s(n, i[r]).length; r++);
                n.level = r, (i[r] || (i[r] = [])).push(n)
            }
            return i
        }

        function i(t) {
            var e, n, r, i, o;
            for (e = 0; e < t.length; e++)
                for (n = t[e], r = 0; r < n.length; r++)
                    for (i = n[r], i.forwardSegs = [], o = e + 1; o < t.length; o++) s(i, t[o], i.forwardSegs)
        }

        function o(t) {
            var e, n, r = t.forwardSegs,
                i = 0;
            if (void 0 === t.forwardPressure) {
                for (e = 0; e < r.length; e++) n = r[e], o(n), i = Math.max(i, 1 + n.forwardPressure);
                t.forwardPressure = i
            }
        }

        function s(t, e, n) {
            void 0 === n && (n = []);
            for (var r = 0; r < e.length; r++) a(t, e[r]) && n.push(e[r]);
            return n
        }

        function a(t, e) {
            return t.bottom > e.top && t.top < e.bottom
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var l = n(2),
            u = n(4),
            d = n(44),
            c = function (t) {
                function e(e, n) {
                    var r = t.call(this, e, n) || this;
                    return r.timeGrid = e, r
                }
                return l.__extends(e, t), e.prototype.renderFgSegs = function (t) {
                    this.renderFgSegsIntoContainers(t, this.timeGrid.fgContainerEls)
                }, e.prototype.renderFgSegsIntoContainers = function (t, e) {
                    var n, r;
                    for (n = this.timeGrid.groupSegsByCol(t), r = 0; r < this.timeGrid.colCnt; r++) this.updateFgSegCoords(n[r]);
                    this.timeGrid.attachSegsByCol(n, e)
                }, e.prototype.unrenderFgSegs = function () {
                    this.fgSegs && this.fgSegs.forEach(function (t) {
                        t.el.remove()
                    })
                }, e.prototype.computeEventTimeFormat = function () {
                    return this.opt("noMeridiemTimeFormat")
                }, e.prototype.computeDisplayEventEnd = function () {
                    return !0
                }, e.prototype.fgSegHtml = function (t, e) {
                    var n, r, i, o = this.view,
                        s = o.calendar,
                        a = t.footprint.componentFootprint,
                        l = a.isAllDay,
                        d = t.footprint.eventDef,
                        c = o.isEventDefDraggable(d),
                        p = !e && t.isStart && o.isEventDefResizableFromStart(d),
                        h = !e && t.isEnd && o.isEventDefResizableFromEnd(d),
                        f = this.getSegClasses(t, c, p || h),
                        g = u.cssToStr(this.getSkinCss(d));
                    if (f.unshift("fc-time-grid-event", "fc-v-event"), o.isMultiDayRange(a.unzonedRange)) {
                        if (t.isStart || t.isEnd) {
                            var v = s.msToMoment(t.startMs),
                                y = s.msToMoment(t.endMs);
                            n = this._getTimeText(v, y, l), r = this._getTimeText(v, y, l, "LT"), i = this._getTimeText(v, y, l, null, !1)
                        }
                    } else n = this.getTimeText(t.footprint), r = this.getTimeText(t.footprint, "LT"), i = this.getTimeText(t.footprint, null, !1);
                    return '<a class="' + f.join(" ") + '"' + (d.url ? ' href="' + u.htmlEscape(d.url) + '"' : "") + (g ? ' style="' + g + '"' : "") + '><div class="fc-content">' + (n ? '<div class="fc-time" data-start="' + u.htmlEscape(i) + '" data-full="' + u.htmlEscape(r) + '"><span>' + u.htmlEscape(n) + "</span></div>" : "") + (d.title ? '<div class="fc-title">' + u.htmlEscape(d.title) + "</div>" : "") + '</div><div class="fc-bg"></div>' + (h ? '<div class="fc-resizer fc-end-resizer"></div>' : "") + "</a>"
                }, e.prototype.updateFgSegCoords = function (t) {
                    this.timeGrid.computeSegVerticals(t), this.computeFgSegHorizontals(t), this.timeGrid.assignSegVerticals(t), this.assignFgSegHorizontals(t)
                }, e.prototype.computeFgSegHorizontals = function (t) {
                    var e, n, s;
                    if (this.sortEventSegs(t), e = r(t), i(e), n = e[0]) {
                        for (s = 0; s < n.length; s++) o(n[s]);
                        for (s = 0; s < n.length; s++) this.computeFgSegForwardBack(n[s], 0, 0)
                    }
                }, e.prototype.computeFgSegForwardBack = function (t, e, n) {
                    var r, i = t.forwardSegs;
                    if (void 0 === t.forwardCoord)
                        for (i.length ? (this.sortForwardSegs(i), this.computeFgSegForwardBack(i[0], e + 1, n), t.forwardCoord = i[0].backwardCoord) : t.forwardCoord = 1, t.backwardCoord = t.forwardCoord - (t.forwardCoord - n) / (e + 1), r = 0; r < i.length; r++) this.computeFgSegForwardBack(i[r], 0, t.forwardCoord)
                }, e.prototype.sortForwardSegs = function (t) {
                    t.sort(u.proxy(this, "compareForwardSegs"))
                }, e.prototype.compareForwardSegs = function (t, e) {
                    return e.forwardPressure - t.forwardPressure || (t.backwardCoord || 0) - (e.backwardCoord || 0) || this.compareEventSegs(t, e)
                }, e.prototype.assignFgSegHorizontals = function (t) {
                    var e, n;
                    for (e = 0; e < t.length; e++) n = t[e], n.el.css(this.generateFgSegHorizontalCss(n)), n.footprint.eventDef.title && n.bottom - n.top < 30 && n.el.addClass("fc-short")
                }, e.prototype.generateFgSegHorizontalCss = function (t) {
                    var e, n, r = this.opt("slotEventOverlap"),
                        i = t.backwardCoord,
                        o = t.forwardCoord,
                        s = this.timeGrid.generateSegVerticalCss(t),
                        a = this.timeGrid.isRTL;
                    return r && (o = Math.min(1, i + 2 * (o - i))), a ? (e = 1 - o, n = i) : (e = i, n = 1 - o), s.zIndex = t.level + 1, s.left = 100 * e + "%", s.right = 100 * n + "%", r && t.forwardPressure && (s[a ? "marginLeft" : "marginRight"] = 20), s
                }, e
            }(d.default);
        e.default = c
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(63),
            s = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.renderSegs = function (t, e) {
                    var n, r, o, s = [];
                    for (this.eventRenderer.renderFgSegsIntoContainers(t, this.component.helperContainerEls), n = 0; n < t.length; n++) r = t[n], e && e.col === r.col && (o = e.el, r.el.css({
                        left: o.css("left"),
                        right: o.css("right"),
                        "margin-left": o.css("margin-left"),
                        "margin-right": o.css("margin-right")
                    })), s.push(r.el[0]);
                    return i(s)
                }, e
            }(o.default);
        e.default = s
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(62),
            o = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.attachSegEls = function (t, e) {
                    var n, r = this.component;
                    return "bgEvent" === t ? n = r.bgContainerEls : "businessHours" === t ? n = r.businessContainerEls : "highlight" === t && (n = r.highlightContainerEls), r.updateSegVerticals(e), r.attachSegsByCol(r.groupSegsByCol(e), n), e.map(function (t) {
                        return t.el[0]
                    })
                }, e
            }(i.default);
        e.default = o
    }, function (t, e, n) {
        function r(t, e) {
            var n, r;
            for (n = 0; n < e.length; n++)
                if (r = e[n], r.leftCol <= t.rightCol && r.rightCol >= t.leftCol) return !0;
            return !1
        }

        function i(t, e) {
            return t.leftCol - e.leftCol
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = n(2),
            s = n(3),
            a = n(4),
            l = n(44),
            u = function (t) {
                function e(e, n) {
                    var r = t.call(this, e, n) || this;
                    return r.dayGrid = e, r
                }
                return o.__extends(e, t), e.prototype.renderBgRanges = function (e) {
                    e = s.grep(e, function (t) {
                        return t.eventDef.isAllDay()
                    }), t.prototype.renderBgRanges.call(this, e)
                }, e.prototype.renderFgSegs = function (t) {
                    var e = this.rowStructs = this.renderSegRows(t);
                    this.dayGrid.rowEls.each(function (t, n) {
                        s(n).find(".fc-content-skeleton > table").append(e[t].tbodyEl)
                    })
                }, e.prototype.unrenderFgSegs = function () {
                    for (var t, e = this.rowStructs || []; t = e.pop();) t.tbodyEl.remove();
                    this.rowStructs = null
                }, e.prototype.renderSegRows = function (t) {
                    var e, n, r = [];
                    for (e = this.groupSegRows(t), n = 0; n < e.length; n++) r.push(this.renderSegRow(n, e[n]));
                    return r
                }, e.prototype.renderSegRow = function (t, e) {
                    function n(t) {
                        for (; o < t;) d = (y[r - 1] || [])[o], d ? d.attr("rowspan", parseInt(d.attr("rowspan") || 1, 10) + 1) : (d = s("<td>"), a.append(d)), v[r][o] = d, y[r][o] = d, o++
                    }
                    var r, i, o, a, l, u, d, c = this.dayGrid.colCnt,
                        p = this.buildSegLevels(e),
                        h = Math.max(1, p.length),
                        f = s("<tbody>"),
                        g = [],
                        v = [],
                        y = [];
                    for (r = 0; r < h; r++) {
                        if (i = p[r], o = 0, a = s("<tr>"), g.push([]), v.push([]), y.push([]), i)
                            for (l = 0; l < i.length; l++) {
                                for (u = i[l], n(u.leftCol), d = s('<td class="fc-event-container">').append(u.el), u.leftCol !== u.rightCol ? d.attr("colspan", u.rightCol - u.leftCol + 1) : y[r][o] = d; o <= u.rightCol;) v[r][o] = d, g[r][o] = u, o++;
                                a.append(d)
                            }
                        n(c), this.dayGrid.bookendCells(a), f.append(a)
                    }
                    return {
                        row: t,
                        tbodyEl: f,
                        cellMatrix: v,
                        segMatrix: g,
                        segLevels: p,
                        segs: e
                    }
                }, e.prototype.buildSegLevels = function (t) {
                    var e, n, o, s = [];
                    for (this.sortEventSegs(t), e = 0; e < t.length; e++) {
                        for (n = t[e], o = 0; o < s.length && r(n, s[o]); o++);
                        n.level = o, (s[o] || (s[o] = [])).push(n)
                    }
                    for (o = 0; o < s.length; o++) s[o].sort(i);
                    return s
                }, e.prototype.groupSegRows = function (t) {
                    var e, n = [];
                    for (e = 0; e < this.dayGrid.rowCnt; e++) n.push([]);
                    for (e = 0; e < t.length; e++) n[t[e].row].push(t[e]);
                    return n
                }, e.prototype.computeEventTimeFormat = function () {
                    return this.opt("extraSmallTimeFormat")
                }, e.prototype.computeDisplayEventEnd = function () {
                    return 1 === this.dayGrid.colCnt
                }, e.prototype.fgSegHtml = function (t, e) {
                    var n, r, i = this.view,
                        o = t.footprint.eventDef,
                        s = t.footprint.componentFootprint.isAllDay,
                        l = i.isEventDefDraggable(o),
                        u = !e && s && t.isStart && i.isEventDefResizableFromStart(o),
                        d = !e && s && t.isEnd && i.isEventDefResizableFromEnd(o),
                        c = this.getSegClasses(t, l, u || d),
                        p = a.cssToStr(this.getSkinCss(o)),
                        h = "";
                    return c.unshift("fc-day-grid-event", "fc-h-event"), t.isStart && (n = this.getTimeText(t.footprint)) && (h = '<span class="fc-time">' + a.htmlEscape(n) + "</span>"), r = '<span class="fc-title">' + (a.htmlEscape(o.title || "") || "&nbsp;") + "</span>", '<a class="' + c.join(" ") + '"' + (o.url ? ' href="' + a.htmlEscape(o.url) + '"' : "") + (p ? ' style="' + p + '"' : "") + '><div class="fc-content">' + (this.dayGrid.isRTL ? r + " " + h : h + " " + r) + "</div>" + (u ? '<div class="fc-resizer fc-start-resizer"></div>' : "") + (d ? '<div class="fc-resizer fc-end-resizer"></div>' : "") + "</a>"
                }, e
            }(l.default);
        e.default = u
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(63),
            s = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.renderSegs = function (t, e) {
                    var n, r = [];
                    return n = this.eventRenderer.renderSegRows(t), this.component.rowEls.each(function (t, o) {
                        var s, a, l = i(o),
                            u = i('<div class="fc-helper-skeleton"><table></table></div>');
                        e && e.row === t ? a = e.el.position().top : (s = l.find(".fc-content-skeleton tbody"), s.length || (s = l.find(".fc-content-skeleton table")), a = s.position().top), u.css("top", a).find("table").append(n[t].tbodyEl), l.append(u), r.push(u[0])
                    }), i(r)
                }, e
            }(o.default);
        e.default = s
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(62),
            s = function (t) {
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    return e.fillSegTag = "td", e
                }
                return r.__extends(e, t), e.prototype.attachSegEls = function (t, e) {
                    var n, r, i, o = [];
                    for (n = 0; n < e.length; n++) r = e[n], i = this.renderFillRow(t, r), this.component.rowEls.eq(r.row).append(i), o.push(i[0]);
                    return o
                }, e.prototype.renderFillRow = function (t, e) {
                    var n, r, o, s = this.component.colCnt,
                        a = e.leftCol,
                        l = e.rightCol + 1;
                    return n = "businessHours" === t ? "bgevent" : t.toLowerCase(), r = i('<div class="fc-' + n + '-skeleton"><table><tr></tr></table></div>'), o = r.find("tr"), a > 0 && o.append(new Array(a + 1).join("<td></td>")), o.append(e.el.attr("colspan", l - a)), l < s && o.append(new Array(s - l + 1).join("<td></td>")), this.component.bookendCells(o), r
                }, e
            }(o.default);
        e.default = s
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(0),
            o = n(4),
            s = n(67),
            a = n(247),
            l = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.setGridHeight = function (t, e) {
                    e && (t *= this.dayGrid.rowCnt / 6), o.distributeHeight(this.dayGrid.rowEls, t, !e)
                }, e.prototype.isDateInOtherMonth = function (t, e) {
                    return t.month() !== i.utc(e.currentUnzonedRange.startMs).month()
                }, e
            }(s.default);
        e.default = l, l.prototype.dateProfileGeneratorClass = a.default
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(68),
            o = n(5),
            s = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.buildRenderRange = function (e, n, r) {
                    var i, s = t.prototype.buildRenderRange.call(this, e, n, r),
                        a = this.msToUtcMoment(s.startMs, r),
                        l = this.msToUtcMoment(s.endMs, r);
                    return this.opt("fixedWeekCount") && (i = Math.ceil(l.diff(a, "weeks", !0)), l.add(6 - i, "weeks")), new o.default(a, l)
                }, e
            }(i.default);
        e.default = s
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(4),
            s = n(5),
            a = n(43),
            l = n(41),
            u = n(249),
            d = n(250),
            c = function (t) {
                function e(e, n) {
                    var r = t.call(this, e, n) || this;
                    return r.segSelector = ".fc-list-item", r.scroller = new l.default({
                        overflowX: "hidden",
                        overflowY: "auto"
                    }), r
                }
                return r.__extends(e, t), e.prototype.renderSkeleton = function () {
                    this.el.addClass("fc-list-view " + this.calendar.theme.getClass("listView")), this.scroller.render(), this.scroller.el.appendTo(this.el), this.contentEl = this.scroller.scrollEl
                }, e.prototype.unrenderSkeleton = function () {
                    this.scroller.destroy()
                }, e.prototype.updateSize = function (e, n, r) {
                    t.prototype.updateSize.call(this, e, n, r), this.scroller.clear(), n || this.scroller.setHeight(this.computeScrollerHeight(e))
                }, e.prototype.computeScrollerHeight = function (t) {
                    return t - o.subtractInnerElHeight(this.el, this.scroller.el)
                }, e.prototype.renderDates = function (t) {
                    for (var e = this.calendar, n = e.msToUtcMoment(t.renderUnzonedRange.startMs, !0), r = e.msToUtcMoment(t.renderUnzonedRange.endMs, !0), i = [], o = []; n < r;) i.push(n.clone()), o.push(new s.default(n, n.clone().add(1, "day"))), n.add(1, "day");
                    this.dayDates = i, this.dayRanges = o
                }, e.prototype.componentFootprintToSegs = function (t) {
                    var e, n, r, i = this.dayRanges,
                        o = [];
                    for (e = 0; e < i.length; e++)
                        if ((n = t.unzonedRange.intersect(i[e])) && (r = {
                                startMs: n.startMs,
                                endMs: n.endMs,
                                isStart: n.isStart,
                                isEnd: n.isEnd,
                                dayIndex: e
                            }, o.push(r), !r.isEnd && !t.isAllDay && e + 1 < i.length && t.unzonedRange.endMs < i[e + 1].startMs + this.nextDayThreshold)) {
                            r.endMs = t.unzonedRange.endMs, r.isEnd = !0;
                            break
                        } return o
                }, e.prototype.renderEmptyMessage = function () {
                    this.contentEl.html('<div class="fc-list-empty-wrap2"><div class="fc-list-empty-wrap1"><div class="fc-list-empty">' + o.htmlEscape(this.opt("noEventsMessage")) + "</div></div></div>")
                }, e.prototype.renderSegList = function (t) {
                    var e, n, r, o = this.groupSegsByDay(t),
                        s = i('<table class="fc-list-table ' + this.calendar.theme.getClass("tableList") + '"><tbody></tbody></table>'),
                        a = s.find("tbody");
                    for (e = 0; e < o.length; e++)
                        if (n = o[e])
                            for (a.append(this.dayHeaderHtml(this.dayDates[e])), this.eventRenderer.sortEventSegs(n), r = 0; r < n.length; r++) a.append(n[r].el);
                    this.contentEl.empty().append(s)
                }, e.prototype.groupSegsByDay = function (t) {
                    var e, n, r = [];
                    for (e = 0; e < t.length; e++) n = t[e], (r[n.dayIndex] || (r[n.dayIndex] = [])).push(n);
                    return r
                }, e.prototype.dayHeaderHtml = function (t) {
                    var e = this.opt("listDayFormat"),
                        n = this.opt("listDayAltFormat");
                    return '<tr class="fc-list-heading" data-date="' + t.format("YYYY-MM-DD") + '"><td class="' + (this.calendar.theme.getClass("tableListHeading") || this.calendar.theme.getClass("widgetHeader")) + '" colspan="3">' + (e ? this.buildGotoAnchorHtml(t, {
                        class: "fc-list-heading-main"
                    }, o.htmlEscape(t.format(e))) : "") + (n ? this.buildGotoAnchorHtml(t, {
                        class: "fc-list-heading-alt"
                    }, o.htmlEscape(t.format(n))) : "") + "</td></tr>"
                }, e
            }(a.default);
        e.default = c, c.prototype.eventRendererClass = u.default, c.prototype.eventPointingClass = d.default
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(4),
            o = n(44),
            s = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.renderFgSegs = function (t) {
                    t.length ? this.component.renderSegList(t) : this.component.renderEmptyMessage()
                }, e.prototype.fgSegHtml = function (t) {
                    var e, n = this.view,
                        r = n.calendar,
                        o = r.theme,
                        s = t.footprint,
                        a = s.eventDef,
                        l = s.componentFootprint,
                        u = a.url,
                        d = ["fc-list-item"].concat(this.getClasses(a)),
                        c = this.getBgColor(a);
                    return e = l.isAllDay ? n.getAllDayHtml() : n.isMultiDayRange(l.unzonedRange) ? t.isStart || t.isEnd ? i.htmlEscape(this._getTimeText(r.msToMoment(t.startMs), r.msToMoment(t.endMs), l.isAllDay)) : n.getAllDayHtml() : i.htmlEscape(this.getTimeText(s)), u && d.push("fc-has-url"), '<tr class="' + d.join(" ") + '">' + (this.displayEventTime ? '<td class="fc-list-item-time ' + o.getClass("widgetContent") + '">' + (e || "") + "</td>" : "") + '<td class="fc-list-item-marker ' + o.getClass("widgetContent") + '"><span class="fc-event-dot"' + (c ? ' style="background-color:' + c + '"' : "") + '></span></td><td class="fc-list-item-title ' + o.getClass("widgetContent") + '"><a' + (u ? ' href="' + i.htmlEscape(u) + '"' : "") + ">" + i.htmlEscape(a.title || "") + "</a></td></tr>"
                }, e.prototype.computeEventTimeFormat = function () {
                    return this.opt("mediumTimeFormat")
                }, e
            }(o.default);
        e.default = s
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(64),
            s = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e.prototype.handleClick = function (e, n) {
                    var r;
                    t.prototype.handleClick.call(this, e, n), i(n.target).closest("a[href]").length || (r = e.footprint.eventDef.url) && !n.isDefaultPrevented() && (window.location.href = r)
                }, e
            }(o.default);
        e.default = s
    }, , , , , , function (t, e, n) {
        var r = n(3),
            i = n(18),
            o = n(4),
            s = n(232);
        n(11), n(49), n(260), n(261), n(264), n(265), n(266), n(267), r.fullCalendar = i, r.fn.fullCalendar = function (t) {
            var e = Array.prototype.slice.call(arguments, 1),
                n = this;
            return this.each(function (i, a) {
                var l, u = r(a),
                    d = u.data("fullCalendar");
                "string" == typeof t ? "getCalendar" === t ? i || (n = d) : "destroy" === t ? d && (d.destroy(), u.removeData("fullCalendar")) : d ? r.isFunction(d[t]) ? (l = d[t].apply(d, e), i || (n = l), "destroy" === t && u.removeData("fullCalendar")) : o.warn("'" + t + "' is an unknown FullCalendar method.") : o.warn("Attempting to call a FullCalendar method on an element with no calendar.") : d || (d = new s.default(u, t), u.data("fullCalendar", d), d.render())
            }), n
        }, t.exports = i
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(3),
            i = n(4),
            o = function () {
                function t(t, e) {
                    this.el = null, this.viewsWithButtons = [], this.calendar = t, this.toolbarOptions = e
                }
                return t.prototype.setToolbarOptions = function (t) {
                    this.toolbarOptions = t
                }, t.prototype.render = function () {
                    var t = this.toolbarOptions.layout,
                        e = this.el;
                    t ? (e ? e.empty() : e = this.el = r("<div class='fc-toolbar " + this.toolbarOptions.extraClasses + "'>"), e.append(this.renderSection("left")).append(this.renderSection("right")).append(this.renderSection("center")).append('<div class="fc-clear"></div>')) : this.removeElement()
                }, t.prototype.removeElement = function () {
                    this.el && (this.el.remove(), this.el = null)
                }, t.prototype.renderSection = function (t) {
                    var e = this,
                        n = this.calendar,
                        o = n.theme,
                        s = n.optionsManager,
                        a = n.viewSpecManager,
                        l = r('<div class="fc-' + t + '">'),
                        u = this.toolbarOptions.layout[t],
                        d = s.get("customButtons") || {},
                        c = s.overrides.buttonText || {},
                        p = s.get("buttonText") || {};
                    return u && r.each(u.split(" "), function (t, s) {
                        var u, h = r(),
                            f = !0;
                        r.each(s.split(","), function (t, s) {
                            var l, u, g, v, y, m, b, w, D;
                            "title" === s ? (h = h.add(r("<h2>&nbsp;</h2>")), f = !1) : ((l = d[s]) ? (g = function (t) {
                                l.click && l.click.call(w[0], t)
                            }, (v = o.getCustomButtonIconClass(l)) || (v = o.getIconClass(s)) || (y = l.text)) : (u = a.getViewSpec(s)) ? (e.viewsWithButtons.push(s), g = function () {
                                n.changeView(s)
                            }, (y = u.buttonTextOverride) || (v = o.getIconClass(s)) || (y = u.buttonTextDefault)) : n[s] && (g = function () {
                                n[s]()
                            }, (y = c[s]) || (v = o.getIconClass(s)) || (y = p[s])), g && (b = ["fc-" + s + "-button", o.getClass("button"), o.getClass("stateDefault")], y ? (m = i.htmlEscape(y), D = "") : v && (m = "<span class='" + v + "'></span>", D = ' aria-label="' + s + '"'), w = r('<button type="button" class="' + b.join(" ") + '"' + D + ">" + m + "</button>").click(function (t) {
                                w.hasClass(o.getClass("stateDisabled")) || (g(t), (w.hasClass(o.getClass("stateActive")) || w.hasClass(o.getClass("stateDisabled"))) && w.removeClass(o.getClass("stateHover")))
                            }).mousedown(function () {
                                w.not("." + o.getClass("stateActive")).not("." + o.getClass("stateDisabled")).addClass(o.getClass("stateDown"))
                            }).mouseup(function () {
                                w.removeClass(o.getClass("stateDown"))
                            }).hover(function () {
                                w.not("." + o.getClass("stateActive")).not("." + o.getClass("stateDisabled")).addClass(o.getClass("stateHover"))
                            }, function () {
                                w.removeClass(o.getClass("stateHover")).removeClass(o.getClass("stateDown"))
                            }), h = h.add(w)))
                        }), f && h.first().addClass(o.getClass("cornerLeft")).end().last().addClass(o.getClass("cornerRight")).end(), h.length > 1 ? (u = r("<div>"), f && u.addClass(o.getClass("buttonGroup")), u.append(h), l.append(u)) : l.append(h)
                    }), l
                }, t.prototype.updateTitle = function (t) {
                    this.el && this.el.find("h2").text(t)
                }, t.prototype.activateButton = function (t) {
                    this.el && this.el.find(".fc-" + t + "-button").addClass(this.calendar.theme.getClass("stateActive"))
                }, t.prototype.deactivateButton = function (t) {
                    this.el && this.el.find(".fc-" + t + "-button").removeClass(this.calendar.theme.getClass("stateActive"))
                }, t.prototype.disableButton = function (t) {
                    this.el && this.el.find(".fc-" + t + "-button").prop("disabled", !0).addClass(this.calendar.theme.getClass("stateDisabled"))
                }, t.prototype.enableButton = function (t) {
                    this.el && this.el.find(".fc-" + t + "-button").prop("disabled", !1).removeClass(this.calendar.theme.getClass("stateDisabled"))
                }, t.prototype.getViewsWithButtons = function () {
                    return this.viewsWithButtons
                }, t
            }();
        e.default = o
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(3),
            o = n(4),
            s = n(33),
            a = n(32),
            l = n(51),
            u = function (t) {
                function e(e, n) {
                    var r = t.call(this) || this;
                    return r._calendar = e, r.overrides = i.extend({}, n), r.dynamicOverrides = {}, r.compute(), r
                }
                return r.__extends(e, t), e.prototype.add = function (t) {
                    var e, n = 0;
                    this.recordOverrides(t);
                    for (e in t) n++;
                    if (1 === n) {
                        if ("height" === e || "contentHeight" === e || "aspectRatio" === e) return void this._calendar.updateViewSize(!0);
                        if ("defaultDate" === e) return;
                        if ("businessHours" === e) return;
                        if (/^(event|select)(Overlap|Constraint|Allow)$/.test(e)) return;
                        if ("timezone" === e) return void this._calendar.view.flash("initialEvents")
                    }
                    this._calendar.renderHeader(), this._calendar.renderFooter(), this._calendar.viewsByType = {}, this._calendar.reinitView()
                }, e.prototype.compute = function () {
                    var t, e, n, r, i;
                    t = o.firstDefined(this.dynamicOverrides.locale, this.overrides.locale), e = a.localeOptionHash[t], e || (t = s.globalDefaults.locale, e = a.localeOptionHash[t] || {}), n = o.firstDefined(this.dynamicOverrides.isRTL, this.overrides.isRTL, e.isRTL, s.globalDefaults.isRTL), r = n ? s.rtlDefaults : {}, this.dirDefaults = r, this.localeDefaults = e, i = s.mergeOptions([s.globalDefaults, r, e, this.overrides, this.dynamicOverrides]), a.populateInstanceComputableOptions(i), this.reset(i)
                }, e.prototype.recordOverrides = function (t) {
                    var e;
                    for (e in t) this.dynamicOverrides[e] = t[e];
                    this._calendar.viewSpecManager.clearCache(), this.compute()
                }, e
            }(l.default);
        e.default = u
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(0),
            i = n(3),
            o = n(24),
            s = n(4),
            a = n(33),
            l = n(32),
            u = function () {
                function t(t, e) {
                    this.optionsManager = t, this._calendar = e, this.clearCache()
                }
                return t.prototype.clearCache = function () {
                    this.viewSpecCache = {}
                }, t.prototype.getViewSpec = function (t) {
                    var e = this.viewSpecCache;
                    return e[t] || (e[t] = this.buildViewSpec(t))
                }, t.prototype.getUnitViewSpec = function (t) {
                    var e, n, r;
                    if (-1 !== i.inArray(t, s.unitsDesc))
                        for (e = this._calendar.header.getViewsWithButtons(), i.each(o.viewHash, function (t) {
                                e.push(t)
                            }), n = 0; n < e.length; n++)
                            if ((r = this.getViewSpec(e[n])) && r.singleUnit === t) return r
                }, t.prototype.buildViewSpec = function (t) {
                    for (var e, n, i, l, u, d = this.optionsManager.overrides.views || {}, c = [], p = [], h = [], f = t; f;) e = o.viewHash[f], n = d[f], f = null, "function" == typeof e && (e = {
                        class: e
                    }), e && (c.unshift(e), p.unshift(e.defaults || {}), i = i || e.duration, f = f || e.type), n && (h.unshift(n), i = i || n.duration, f = f || n.type);
                    return e = s.mergeProps(c), e.type = t, !!e.class && (i = i || this.optionsManager.dynamicOverrides.duration || this.optionsManager.overrides.duration, i && (l = r.duration(i), l.valueOf() && (u = s.computeDurationGreatestUnit(l, i), e.duration = l, e.durationUnit = u, 1 === l.as(u) && (e.singleUnit = u, h.unshift(d[u] || {})))), e.defaults = a.mergeOptions(p), e.overrides = a.mergeOptions(h), this.buildViewSpecOptions(e), this.buildViewSpecButtonText(e, t), e)
                }, t.prototype.buildViewSpecOptions = function (t) {
                    var e = this.optionsManager;
                    t.options = a.mergeOptions([a.globalDefaults, t.defaults, e.dirDefaults, e.localeDefaults, e.overrides, t.overrides, e.dynamicOverrides]), l.populateInstanceComputableOptions(t.options)
                }, t.prototype.buildViewSpecButtonText = function (t, e) {
                    function n(n) {
                        var r = n.buttonText || {};
                        return r[e] || (t.buttonTextKey ? r[t.buttonTextKey] : null) || (t.singleUnit ? r[t.singleUnit] : null)
                    }
                    var r = this.optionsManager;
                    t.buttonTextOverride = n(r.dynamicOverrides) || n(r.overrides) || t.overrides.buttonText, t.buttonTextDefault = n(r.localeDefaults) || n(r.dirDefaults) || t.defaults.buttonText || n(a.globalDefaults) || (t.duration ? this._calendar.humanizeDuration(t.duration) : null) || e
                }, t
            }();
        e.default = u
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(38),
            i = n(56),
            o = n(223),
            s = n(224);
        r.default.registerClass(i.default), r.default.registerClass(o.default), r.default.registerClass(s.default)
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(57),
            i = n(221),
            o = n(222),
            s = n(262),
            a = n(263);
        r.defineThemeSystem("standard", i.default), r.defineThemeSystem("jquery-ui", o.default), r.defineThemeSystem("bootstrap3", s.default), r.defineThemeSystem("bootstrap4", a.default)
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(22),
            o = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e
            }(i.default);
        e.default = o, o.prototype.classes = {
            widget: "fc-bootstrap3",
            tableGrid: "table-bordered",
            tableList: "table",
            tableListHeading: "active",
            buttonGroup: "btn-group",
            button: "btn btn-default",
            stateActive: "active",
            stateDisabled: "disabled",
            today: "alert alert-info",
            popover: "panel panel-default",
            popoverHeader: "panel-heading",
            popoverContent: "panel-body",
            headerRow: "panel-default",
            dayRow: "panel-default",
            listView: "panel panel-default"
        }, o.prototype.baseIconClass = "glyphicon", o.prototype.iconClasses = {
            close: "glyphicon-remove",
            prev: "glyphicon-chevron-left",
            next: "glyphicon-chevron-right",
            prevYear: "glyphicon-backward",
            nextYear: "glyphicon-forward"
        }, o.prototype.iconOverrideOption = "bootstrapGlyphicons", o.prototype.iconOverrideCustomButtonOption = "bootstrapGlyphicon", o.prototype.iconOverridePrefix = "glyphicon-"
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(2),
            i = n(22),
            o = function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return r.__extends(e, t), e
            }(i.default);
        e.default = o, o.prototype.classes = {
            widget: "fc-bootstrap4",
            tableGrid: "table-bordered",
            tableList: "table",
            tableListHeading: "table-active",
            buttonGroup: "btn-group",
            button: "btn btn-primary",
            stateActive: "active",
            stateDisabled: "disabled",
            today: "alert alert-info",
            popover: "card card-primary",
            popoverHeader: "card-header",
            popoverContent: "card-body",
            headerRow: "table-bordered",
            dayRow: "table-bordered",
            listView: "card card-primary"
        }, o.prototype.baseIconClass = "fa", o.prototype.iconClasses = {
            close: "fa-times",
            prev: "fa-chevron-left",
            next: "fa-chevron-right",
            prevYear: "fa-angle-double-left",
            nextYear: "fa-angle-double-right"
        }, o.prototype.iconOverrideOption = "bootstrapFontAwesome", o.prototype.iconOverrideCustomButtonOption = "bootstrapFontAwesome", o.prototype.iconOverridePrefix = "fa-"
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(24),
            i = n(67),
            o = n(246);
        r.defineView("basic", {
            class: i.default
        }), r.defineView("basicDay", {
            type: "basic",
            duration: {
                days: 1
            }
        }), r.defineView("basicWeek", {
            type: "basic",
            duration: {
                weeks: 1
            }
        }), r.defineView("month", {
            class: o.default,
            duration: {
                months: 1
            },
            defaults: {
                fixedWeekCount: !0
            }
        })
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(24),
            i = n(238);
        r.defineView("agenda", {
            class: i.default,
            defaults: {
                allDaySlot: !0,
                slotDuration: "00:30:00",
                slotEventOverlap: !0
            }
        }), r.defineView("agendaDay", {
            type: "agenda",
            duration: {
                days: 1
            }
        }), r.defineView("agendaWeek", {
            type: "agenda",
            duration: {
                weeks: 1
            }
        })
    }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = n(24),
            i = n(248);
        r.defineView("list", {
            class: i.default,
            buttonTextKey: "list",
            defaults: {
                buttonText: "list",
                listDayFormat: "LL",
                noEventsMessage: "No events to display"
            }
        }), r.defineView("listDay", {
            type: "list",
            duration: {
                days: 1
            },
            defaults: {
                listDayFormat: "dddd"
            }
        }), r.defineView("listWeek", {
            type: "list",
            duration: {
                weeks: 1
            },
            defaults: {
                listDayFormat: "dddd",
                listDayAltFormat: "LL"
            }
        }), r.defineView("listMonth", {
            type: "list",
            duration: {
                month: 1
            },
            defaults: {
                listDayAltFormat: "dddd"
            }
        }), r.defineView("listYear", {
            type: "list",
            duration: {
                year: 1
            },
            defaults: {
                listDayAltFormat: "dddd"
            }
        })
    }, function (t, e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }])
});
! function (e, o) {
    "object" == typeof exports && "object" == typeof module ? module.exports = o(require("moment"), require("fullcalendar")) : "function" == typeof define && define.amd ? define(["moment", "fullcalendar"], o) : "object" == typeof exports ? o(require("moment"), require("fullcalendar")) : o(e.moment, e.FullCalendar)
}("undefined" != typeof self ? self : this, function (r, t) {
    return s = {}, n.m = a = {
        0: function (e, o) {
            e.exports = r
        },
        1: function (e, o) {
            e.exports = t
        },
        121: function (e, o, r) {
            Object.defineProperty(o, "__esModule", {
                value: !0
            }), r(122);
            var t = r(1);
            t.datepickerLocale("es", "es", {
                closeText: "Cerrar",
                prevText: "&#x3C;Ant",
                nextText: "Sig&#x3E;",
                currentText: "Hoy",
                monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
                monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
                dayNames: ["domingo", "lunes", "martes", "mi??rcoles", "jueves", "viernes", "s??bado"],
                dayNamesShort: ["dom", "lun", "mar", "mi??", "jue", "vie", "s??b"],
                dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
                weekHeader: "Sm",
                dateFormat: "dd/mm/yy",
                firstDay: 1,
                isRTL: !1,
                showMonthAfterYear: !1,
                yearSuffix: ""
            }), t.locale("es", {
                buttonText: {
                    month: "Mes",
                    week: "Semana",
                    day: "D??a",
                    list: "Agenda"
                },
                allDayHtml: "Todo<br/>el d??a",
                eventLimitText: "m??s",
                noEventsMessage: "No hay eventos para mostrar"
            })
        },
        122: function (e, o, r) {
            var t, n, a, s, i;
            t = r(0), n = "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"), a = "ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"), s = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i], i = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i, t.defineLocale("es", {
                months: "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),
                monthsShort: function (e, o) {
                    return e ? /-MMM-/.test(o) ? a[e.month()] : n[e.month()] : n
                },
                monthsRegex: i,
                monthsShortRegex: i,
                monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
                monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
                monthsParse: s,
                longMonthsParse: s,
                shortMonthsParse: s,
                weekdays: "domingo_lunes_martes_mi??rcoles_jueves_viernes_s??bado".split("_"),
                weekdaysShort: "dom._lun._mar._mi??._jue._vie._s??b.".split("_"),
                weekdaysMin: "do_lu_ma_mi_ju_vi_s??".split("_"),
                weekdaysParseExact: !0,
                longDateFormat: {
                    LT: "H:mm",
                    LTS: "H:mm:ss",
                    L: "DD/MM/YYYY",
                    LL: "D [de] MMMM [de] YYYY",
                    LLL: "D [de] MMMM [de] YYYY H:mm",
                    LLLL: "dddd, D [de] MMMM [de] YYYY H:mm"
                },
                calendar: {
                    sameDay: function () {
                        return "[hoy a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                    },
                    nextDay: function () {
                        return "[ma??ana a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                    },
                    nextWeek: function () {
                        return "dddd [a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                    },
                    lastDay: function () {
                        return "[ayer a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                    },
                    lastWeek: function () {
                        return "[el] dddd [pasado a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                    },
                    sameElse: "L"
                },
                relativeTime: {
                    future: "en %s",
                    past: "hace %s",
                    s: "unos segundos",
                    ss: "%d segundos",
                    m: "un minuto",
                    mm: "%d minutos",
                    h: "una hora",
                    hh: "%d horas",
                    d: "un d??a",
                    dd: "%d d??as",
                    M: "un mes",
                    MM: "%d meses",
                    y: "un a??o",
                    yy: "%d a??os"
                },
                dayOfMonthOrdinalParse: /\d{1,2}??/,
                ordinal: "%d??",
                week: {
                    dow: 1,
                    doy: 4
                },
                invalidDate: "Fecha invalida"
            })
        }
    }, n.c = s, n.d = function (e, o, r) {
        n.o(e, o) || Object.defineProperty(e, o, {
            configurable: !1,
            enumerable: !0,
            get: r
        })
    }, n.n = function (e) {
        var o = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(o, "a", o), o
    }, n.o = function (e, o) {
        return Object.prototype.hasOwnProperty.call(e, o)
    }, n.p = "", n(n.s = 121);

    function n(e) {
        if (s[e]) return s[e].exports;
        var o = s[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return a[e].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    var a, s
});
/*
 Copyright (C) Federico Zivolo 2019
 Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).
 */
(function (a, b) {
    'object' == typeof exports && 'undefined' != typeof module ? module.exports = b(require('popper.js')) : 'function' == typeof define && define.amd ? define(['popper.js'], b) : a.Tooltip = b(a.Popper)
})(this, function (a) {
    'use strict';

    function b(a) {
        return a && '[object Function]' === {}.toString.call(a)
    }
    a = a && a.hasOwnProperty('default') ? a['default'] : a;
    var c = function (a, b) {
            if (!(a instanceof b)) throw new TypeError('Cannot call a class as a function')
        },
        d = function () {
            function a(a, b) {
                for (var c, d = 0; d < b.length; d++) c = b[d], c.enumerable = c.enumerable || !1, c.configurable = !0, 'value' in c && (c.writable = !0), Object.defineProperty(a, c.key, c)
            }
            return function (b, c, d) {
                return c && a(b.prototype, c), d && a(b, d), b
            }
        }(),
        e = Object.assign || function (a) {
            for (var b, c = 1; c < arguments.length; c++)
                for (var d in b = arguments[c], b) Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
            return a
        },
        f = {
            container: !1,
            delay: 0,
            html: !1,
            placement: 'top',
            title: '',
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            trigger: 'hover focus',
            offset: 0,
            arrowSelector: '.tooltip-arrow, .tooltip__arrow',
            innerSelector: '.tooltip-inner, .tooltip__inner'
        },
        g = function () {
            function g(a, b) {
                c(this, g), h.call(this), b = e({}, f, b), a.jquery && (a = a[0]), this.reference = a, this.options = b;
                var d = 'string' == typeof b.trigger ? b.trigger.split(' ').filter(function (a) {
                    return -1 !== ['click', 'hover', 'focus'].indexOf(a)
                }) : [];
                this._isOpen = !1, this._popperOptions = {}, this._setEventListeners(a, d, b)
            }
            return d(g, [{
                key: '_create',
                value: function (a, b, c, d) {
                    var e = window.document.createElement('div');
                    e.innerHTML = b.trim();
                    var f = e.childNodes[0];
                    f.id = 'tooltip_' + Math.random().toString(36).substr(2, 10), f.setAttribute('aria-hidden', 'false');
                    var g = e.querySelector(this.options.innerSelector);
                    return this._addTitleContent(a, c, d, g), f
                }
            }, {
                key: '_addTitleContent',
                value: function (a, c, d, e) {
                    1 === c.nodeType || 11 === c.nodeType ? d && e.appendChild(c) : b(c) ? this._addTitleContent(a, c.call(a), d, e) : d ? e.innerHTML = c : e.textContent = c
                }
            }, {
                key: '_show',
                value: function (b, c) {
                    if (this._isOpen && !this._isOpening) return this;
                    if (this._isOpen = !0, this._tooltipNode) return this._tooltipNode.style.visibility = 'visible', this._tooltipNode.setAttribute('aria-hidden', 'false'), this.popperInstance.update(), this;
                    var d = b.getAttribute('title') || c.title;
                    if (!d) return this;
                    var f = this._create(b, c.template, d, c.html);
                    b.setAttribute('aria-describedby', f.id);
                    var g = this._findContainer(c.container, b);
                    return this._append(f, g), this._popperOptions = e({}, c.popperOptions, {
                        placement: c.placement
                    }), this._popperOptions.modifiers = e({}, this._popperOptions.modifiers, {
                        arrow: e({}, this._popperOptions.modifiers && this._popperOptions.modifiers.arrow, {
                            element: c.arrowSelector
                        }),
                        offset: e({}, this._popperOptions.modifiers && this._popperOptions.modifiers.offset, {
                            offset: c.offset || this._popperOptions.modifiers && this._popperOptions.modifiers.offset && this._popperOptions.modifiers.offset.offset || c.offset
                        })
                    }), c.boundariesElement && (this._popperOptions.modifiers.preventOverflow = {
                        boundariesElement: c.boundariesElement
                    }), this.popperInstance = new a(b, f, this._popperOptions), this._tooltipNode = f, this
                }
            }, {
                key: '_hide',
                value: function () {
                    return this._isOpen ? (this._isOpen = !1, this._tooltipNode.style.visibility = 'hidden', this._tooltipNode.setAttribute('aria-hidden', 'true'), this) : this
                }
            }, {
                key: '_dispose',
                value: function () {
                    var a = this;
                    return this._events.forEach(function (b) {
                        var c = b.func,
                            d = b.event;
                        a.reference.removeEventListener(d, c)
                    }), this._events = [], this._tooltipNode && (this._hide(), this.popperInstance.destroy(), !this.popperInstance.options.removeOnDestroy && (this._tooltipNode.parentNode.removeChild(this._tooltipNode), this._tooltipNode = null)), this
                }
            }, {
                key: '_findContainer',
                value: function (a, b) {
                    return 'string' == typeof a ? a = window.document.querySelector(a) : !1 === a && (a = b.parentNode), a
                }
            }, {
                key: '_append',
                value: function (a, b) {
                    b.appendChild(a)
                }
            }, {
                key: '_setEventListeners',
                value: function (a, b, c) {
                    var d = this,
                        e = [],
                        f = [];
                    b.forEach(function (a) {
                        'hover' === a ? (e.push('mouseenter'), f.push('mouseleave')) : 'focus' === a ? (e.push('focus'), f.push('blur')) : 'click' === a ? (e.push('click'), f.push('click')) : void 0
                    }), e.forEach(function (b) {
                        var e = function (b) {
                            !0 === d._isOpening || (b.usedByTooltip = !0, d._scheduleShow(a, c.delay, c, b))
                        };
                        d._events.push({
                            event: b,
                            func: e
                        }), a.addEventListener(b, e)
                    }), f.forEach(function (b) {
                        var f = function (b) {
                            !0 === b.usedByTooltip || d._scheduleHide(a, c.delay, c, b)
                        };
                        d._events.push({
                            event: b,
                            func: f
                        }), a.addEventListener(b, f), 'click' === b && c.closeOnClickOutside && document.addEventListener('mousedown', function (b) {
                            if (d._isOpening) {
                                var c = d.popperInstance.popper;
                                a.contains(b.target) || c.contains(b.target) || f(b)
                            }
                        }, !0)
                    })
                }
            }, {
                key: '_scheduleShow',
                value: function (a, b, c) {
                    var d = this;
                    this._isOpening = !0;
                    var e = b && b.show || b || 0;
                    this._showTimeout = window.setTimeout(function () {
                        return d._show(a, c)
                    }, e)
                }
            }, {
                key: '_scheduleHide',
                value: function (a, b, c, d) {
                    var e = this;
                    this._isOpening = !1;
                    var f = b && b.hide || b || 0;
                    window.clearTimeout(this._showTimeout), window.setTimeout(function () {
                        if (!1 !== e._isOpen && document.body.contains(e._tooltipNode)) {
                            if ('mouseleave' === d.type) {
                                var f = e._setTooltipNodeEvent(d, a, b, c);
                                if (f) return
                            }
                            e._hide(a, c)
                        }
                    }, f)
                }
            }, {
                key: '_updateTitleContent',
                value: function (a) {
                    if ('undefined' == typeof this._tooltipNode) return void('undefined' != typeof this.options.title && (this.options.title = a));
                    var b = this._tooltipNode.querySelector(this.options.innerSelector);
                    this._clearTitleContent(b, this.options.html, this.reference.getAttribute('title') || this.options.title), this._addTitleContent(this.reference, a, this.options.html, b), this.options.title = a, this.popperInstance.update()
                }
            }, {
                key: '_clearTitleContent',
                value: function (a, b, c) {
                    1 === c.nodeType || 11 === c.nodeType ? b && a.removeChild(c) : b ? a.innerHTML = '' : a.textContent = ''
                }
            }]), g
        }(),
        h = function () {
            var a = this;
            this.show = function () {
                return a._show(a.reference, a.options)
            }, this.hide = function () {
                return a._hide()
            }, this.dispose = function () {
                return a._dispose()
            }, this.toggle = function () {
                return a._isOpen ? a.hide() : a.show()
            }, this.updateTitleContent = function (b) {
                return a._updateTitleContent(b)
            }, this._events = [], this._setTooltipNodeEvent = function (b, c, d, e) {
                var f = b.relatedreference || b.toElement || b.relatedTarget;
                return !!a._tooltipNode.contains(f) && (a._tooltipNode.addEventListener(b.type, function d(f) {
                    var g = f.relatedreference || f.toElement || f.relatedTarget;
                    a._tooltipNode.removeEventListener(b.type, d), c.contains(g) || a._scheduleHide(c, e.delay, e, f)
                }), !0)
            }
        };
    return g
});
