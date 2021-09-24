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
 */(function(factory){
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($, undefined){

	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
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
	function alias(method){
		return function(){
			return this[method].apply(this, arguments);
		};
	}
	function isValidDate(d) {
		return d && !isNaN(d.getTime());
	}

	var DateArray = (function(){
		var extras = {
			get: function(i){
				return this.slice(i)[0];
			},
			contains: function(d){
				// Array.indexOf is not cross-browser;
				// $.inArray doesn't work with Dates
				var val = d && d.valueOf();
				for (var i=0, l=this.length; i < l; i++)
					if (this[i].valueOf() === val)
						return i;
				return -1;
			},
			remove: function(i){
				this.splice(i,1);
			},
			replace: function(new_array){
				if (!new_array)
					return;
				if (!$.isArray(new_array))
					new_array = [new_array];
				this.clear();
				this.push.apply(this, new_array);
			},
			clear: function(){
				this.length = 0;
			},
			copy: function(){
				var a = new DateArray();
				a.replace(this);
				return a;
			}
		};

		return function(){
			var a = [];
			a.push.apply(a, arguments);
			$.extend(a, extras);
			return a;
		};
	})();


	// Picker object

	var Datepicker = function(element, options){
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

		if (this.isInline){
			this.picker.addClass('datepicker-inline').appendTo(this.element);
		}
		else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}

		if (this.o.rtl){
			this.picker.addClass('datepicker-rtl');
		}

		this.viewMode = this.o.startView;

		if (this.o.calendarWeeks)
			this.picker.find('thead .datepicker-title, tfoot .today, tfoot .clear')
						.attr('colspan', function(i, val){
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

		if (this.isInline){
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_resolveViewName: function(view, default_value){
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

		_check_template: function(tmp){
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
			}
			catch (ex) {
				return false;
			}
		},

		_process_options: function(opts){
			// Store raw options for reference
			this._o = $.extend({}, this._o, opts);
			// Processed options
			var o = this.o = $.extend({}, this._o);

			// Check if "de-DE" style date is available, if not language should
			// fallback to 2 letter code eg "de"
			var lang = o.language;
			if (!dates[lang]){
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
			if (o.multidate !== true){
				o.multidate = Number(o.multidate) || false;
				if (o.multidate !== false)
					o.multidate = Math.max(0, o.multidate);
			}
			o.multidateSeparator = String(o.multidateSeparator);

			o.weekStart %= 7;
			o.weekEnd = (o.weekStart + 6) % 7;

			var format = DPGlobal.parseFormat(o.format);
			if (o.startDate !== -Infinity){
				if (!!o.startDate){
					if (o.startDate instanceof Date)
						o.startDate = this._local_to_utc(this._zero_time(o.startDate));
					else
						o.startDate = DPGlobal.parseDate(o.startDate, format, o.language, o.assumeNearbyYear);
				}
				else {
					o.startDate = -Infinity;
				}
			}
			if (o.endDate !== Infinity){
				if (!!o.endDate){
					if (o.endDate instanceof Date)
						o.endDate = this._local_to_utc(this._zero_time(o.endDate));
					else
						o.endDate = DPGlobal.parseDate(o.endDate, format, o.language, o.assumeNearbyYear);
				}
				else {
					o.endDate = Infinity;
				}
			}

			o.daysOfWeekDisabled = o.daysOfWeekDisabled||[];
			if (!$.isArray(o.daysOfWeekDisabled))
				o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
			o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function(d){
				return parseInt(d, 10);
			});

			o.daysOfWeekHighlighted = o.daysOfWeekHighlighted||[];
			if (!$.isArray(o.daysOfWeekHighlighted))
				o.daysOfWeekHighlighted = o.daysOfWeekHighlighted.split(/[,\s]*/);
			o.daysOfWeekHighlighted = $.map(o.daysOfWeekHighlighted, function(d){
				return parseInt(d, 10);
			});

			o.datesDisabled = o.datesDisabled||[];
			if (!$.isArray(o.datesDisabled)) {
				o.datesDisabled = [
					o.datesDisabled
				];
			}
			o.datesDisabled = $.map(o.datesDisabled,function(d){
				return DPGlobal.parseDate(d, format, o.language, o.assumeNearbyYear);
			});

			var plc = String(o.orientation).toLowerCase().split(/\s+/g),
				_plc = o.orientation.toLowerCase();
			plc = $.grep(plc, function(word){
				return /^auto|left|right|top|bottom$/.test(word);
			});
			o.orientation = {x: 'auto', y: 'auto'};
			if (!_plc || _plc === 'auto')
				; // no action
			else if (plc.length === 1){
				switch (plc[0]){
					case 'top':
					case 'bottom':
						o.orientation.y = plc[0];
						break;
					case 'left':
					case 'right':
						o.orientation.x = plc[0];
						break;
				}
			}
			else {
				_plc = $.grep(plc, function(word){
					return /^left|right$/.test(word);
				});
				o.orientation.x = _plc[0] || 'auto';

				_plc = $.grep(plc, function(word){
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
		_applyEvents: function(evs){
			for (var i=0, el, ch, ev; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.on(ev, ch);
			}
		},
		_unapplyEvents: function(evs){
			for (var i=0, el, ev, ch; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.off(ev, ch);
			}
		},
		_buildEvents: function(){
            var events = {
                keyup: $.proxy(function(e){
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
            }
            else if (this.component && this.hasInput) { // component: input + button
                this._events = [
                    // For components that are not readonly, allow keyboard nav
                    [this.inputField, events],
                    [this.component, {
                        click: $.proxy(this.show, this)
                    }]
                ];
            }
			else {
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
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}],
				// Input: listen for blur on element
				[this.element, {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}]
			);

			if (this.o.immediateUpdates) {
				// Trigger input updates immediately on changed year/month
				this._events.push([this.element, {
					'changeYear changeMonth': $.proxy(function(e){
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
					mousedown: $.proxy(function(e){
						// Clicked outside the datepicker, hide it
						if (!(
							this.element.is(e.target) ||
							this.element.find(e.target).length ||
							this.picker.is(e.target) ||
							this.picker.find(e.target).length ||
							this.isInline
						)){
							this.hide();
						}
					}, this)
				}]
			];
		},
		_attachEvents: function(){
			this._detachEvents();
			this._applyEvents(this._events);
		},
		_detachEvents: function(){
			this._unapplyEvents(this._events);
		},
		_attachSecondaryEvents: function(){
			this._detachSecondaryEvents();
			this._applyEvents(this._secondaryEvents);
		},
		_detachSecondaryEvents: function(){
			this._unapplyEvents(this._secondaryEvents);
		},
		_trigger: function(event, altdate){
			var date = altdate || this.dates.get(-1),
				local_date = this._utc_to_local(date);

			this.element.trigger({
				type: event,
				date: local_date,
				dates: $.map(this.dates, this._utc_to_local),
				format: $.proxy(function(ix, format){
					if (arguments.length === 0){
						ix = this.dates.length - 1;
						format = this.o.format;
					}
					else if (typeof ix === 'string'){
						format = ix;
						ix = this.dates.length - 1;
					}
					format = format || this.o.format;
					var date = this.dates.get(ix);
					return DPGlobal.formatDate(date, format, this.o.language);
				}, this)
			});
		},

		show: function(){
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

		hide: function(){
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

		destroy: function(){
			this.hide();
			this._detachEvents();
			this._detachSecondaryEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
			if (!this.isInput){
				delete this.element.data().date;
			}
			return this;
		},

		paste: function(evt){
			var dateString;
			if (evt.originalEvent.clipboardData && evt.originalEvent.clipboardData.types
				&& $.inArray('text/plain', evt.originalEvent.clipboardData.types) !== -1) {
				dateString = evt.originalEvent.clipboardData.getData('text/plain');
			}
			else if (window.clipboardData) {
				dateString = window.clipboardData.getData('Text');
			}
			else {
				return;
			}
			this.setDate(dateString);
			this.update();
			evt.preventDefault();
		},

		_utc_to_local: function(utc){
			return utc && new Date(utc.getTime() + (utc.getTimezoneOffset()*60000));
		},
		_local_to_utc: function(local){
			return local && new Date(local.getTime() - (local.getTimezoneOffset()*60000));
		},
		_zero_time: function(local){
			return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
		},
		_zero_utc_time: function(utc){
			return utc && new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
		},

		getDates: function(){
			return $.map(this.dates, this._utc_to_local);
		},

		getUTCDates: function(){
			return $.map(this.dates, function(d){
				return new Date(d);
			});
		},

		getDate: function(){
			return this._utc_to_local(this.getUTCDate());
		},

		getUTCDate: function(){
			var selected_date = this.dates.get(-1);
			if (typeof selected_date !== 'undefined') {
				return new Date(selected_date);
			} else {
				return null;
			}
		},

		clearDates: function(){
			if (this.inputField) {
				this.inputField.val('');
			}

			this.update();
			this._trigger('changeDate');

			if (this.o.autoclose) {
				this.hide();
			}
		},
		setDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, args);
			this._trigger('changeDate');
			this.setValue();
			return this;
		},

		setUTCDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, $.map(args, this._utc_to_local));
			this._trigger('changeDate');
			this.setValue();
			return this;
		},

		setDate: alias('setDates'),
		setUTCDate: alias('setUTCDates'),
		remove: alias('destroy'),

		setValue: function(){
			var formatted = this.getFormattedDate();
			this.inputField.val(formatted);
			return this;
		},

		getFormattedDate: function(format){
			if (format === undefined)
				format = this.o.format;

			var lang = this.o.language;
			return $.map(this.dates, function(d){
				return DPGlobal.formatDate(d, format, lang);
			}).join(this.o.multidateSeparator);
		},

		getStartDate: function(){
			return this.o.startDate;
		},

		setStartDate: function(startDate){
			this._process_options({startDate: startDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		getEndDate: function(){
			return this.o.endDate;
		},

		setEndDate: function(endDate){
			this._process_options({endDate: endDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
			this.update();
			this.updateNavArrows();
			return this;
		},

		setDaysOfWeekHighlighted: function(daysOfWeekHighlighted){
			this._process_options({daysOfWeekHighlighted: daysOfWeekHighlighted});
			this.update();
			return this;
		},

		setDatesDisabled: function(datesDisabled){
			this._process_options({datesDisabled: datesDisabled});
			this.update();
			this.updateNavArrows();
		},

		place: function(){
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
			this.element.parents().each(function(){
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
				'datepicker-orient-top datepicker-orient-bottom '+
				'datepicker-orient-right datepicker-orient-left'
			);

			if (this.o.orientation.x !== 'auto'){
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
			if (yorient === 'auto'){
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
		update: function(){
			if (!this._allow_update)
				return this;

			var oldDates = this.dates.copy(),
				dates = [],
				fromArgs = false;
			if (arguments.length){
				$.each(arguments, $.proxy(function(i, date){
					if (date instanceof Date)
						date = this._local_to_utc(date);
					dates.push(date);
				}, this));
				fromArgs = true;
			}
			else {
				dates = this.isInput
						? this.element.val()
						: this.element.data('date') || this.inputField.val();
				if (dates && this.o.multidate)
					dates = dates.split(this.o.multidateSeparator);
				else
					dates = [dates];
				delete this.element.data().date;
			}

			dates = $.map(dates, $.proxy(function(date){
				return DPGlobal.parseDate(date, this.o.format, this.o.language, this.o.assumeNearbyYear);
			}, this));
			dates = $.grep(dates, $.proxy(function(date){
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

			if (fromArgs){
				// setting date by clicking
				this.setValue();
			}
			else if (dates.length){
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

		fillDow: function(){
			var dowCnt = this.o.weekStart,
				html = '<tr>';
			if (this.o.calendarWeeks){
				this.picker.find('.datepicker-days .datepicker-switch')
					.attr('colspan', function(i, val){
						return parseInt(val) + 1;
					});
				html += '<th class="cw">&#160;</th>';
			}
			while (dowCnt < this.o.weekStart + 7){
				html += '<th class="dow';
        if ($.inArray(dowCnt, this.o.daysOfWeekDisabled) > -1)
          html += ' disabled';
        html += '">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function(){
      var localDate = this._utc_to_local(this.viewDate);
			var html = '',
			i = 0;
			while (i < 12){
        var focused = localDate && localDate.getMonth() === i ? ' focused' : '';
				html += '<span class="month' + focused + '">' + dates[this.o.language].monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		setRange: function(range){
			if (!range || !range.length)
				delete this.range;
			else
				this.range = $.map(range, function(d){
					return d.valueOf();
				});
			this.fill();
		},

		getClassNames: function(date){
			var cls = [],
				year = this.viewDate.getUTCFullYear(),
				month = this.viewDate.getUTCMonth(),
				today = new Date();
			if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)){
				cls.push('old');
			}
			else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)){
				cls.push('new');
			}
			if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
				cls.push('focused');
			// Compare internal UTC date with local today, not UTC today
			if (this.o.todayHighlight &&
				date.getUTCFullYear() === today.getFullYear() &&
				date.getUTCMonth() === today.getMonth() &&
				date.getUTCDate() === today.getDate()){
				cls.push('today');
			}
			if (this.dates.contains(date) !== -1)
				cls.push('active');
			if (!this.dateWithinRange(date)){
				cls.push('disabled');
			}
			if (this.dateIsDisabled(date)){
				cls.push('disabled', 'disabled-date');	
			} 
			if ($.inArray(date.getUTCDay(), this.o.daysOfWeekHighlighted) !== -1){
				cls.push('highlighted');
			}

			if (this.range){
				if (date > this.range[0] && date < this.range[this.range.length-1]){
					cls.push('range');
				}
				if ($.inArray(date.valueOf(), this.range) !== -1){
					cls.push('selected');
				}
				if (date.valueOf() === this.range[0]){
          cls.push('range-start');
        }
        if (date.valueOf() === this.range[this.range.length-1]){
          cls.push('range-end');
        }
			}
			return cls;
		},

		_fill_yearsView: function(selector, cssClass, factor, step, currentYear, startYear, endYear, callback){
			var html, view, year, steps, startStep, endStep, thisYear, i, classes, tooltip, before;

			html      = '';
			view      = this.picker.find(selector);
			year      = parseInt(currentYear / factor, 10) * factor;
			startStep = parseInt(startYear / step, 10) * step;
			endStep   = parseInt(endYear / step, 10) * step;
			steps     = $.map(this.dates, function(d){
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
					} else if (typeof(before) === 'boolean') {
						before = {enabled: before};
					} else if (typeof(before) === 'string') {
						before = {classes: before};
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

		fill: function(){
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
			var prevMonth = UTCDate(year, month-1, 28),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			if (prevMonth.getUTCFullYear() < 100){
        nextMonth.setUTCFullYear(prevMonth.getUTCFullYear());
      }
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while (prevMonth.valueOf() < nextMonth){
				if (prevMonth.getUTCDay() === this.o.weekStart){
					html.push('<tr>');
					if (this.o.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek =  (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ calWeek +'</td>');
					}
				}
				clsName = this.getClassNames(prevMonth);
				clsName.push('day');

				if (this.o.beforeShowDay !== $.noop){
					before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
					if (before === undefined)
						before = {};
					else if (typeof(before) === 'boolean')
						before = {enabled: before};
					else if (typeof(before) === 'string')
						before = {classes: before};
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

				html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + '>'+prevMonth.getUTCDate() + '</td>');
				tooltip = null;
				if (prevMonth.getUTCDay() === this.o.weekEnd){
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));

			var monthsTitle = dates[this.o.language].monthsTitle || dates['en'].monthsTitle || 'Months';
			var months = this.picker.find('.datepicker-months')
						.find('.datepicker-switch')
							.text(this.o.maxViewMode < 2 ? monthsTitle : year)
							.end()
						.find('span').removeClass('active');

			$.each(this.dates, function(i, d){
				if (d.getUTCFullYear() === year)
					months.eq(d.getUTCMonth()).addClass('active');
			});

			if (year < startYear || year > endYear){
				months.addClass('disabled');
			}
			if (year === startYear){
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year === endYear){
				months.slice(endMonth+1).addClass('disabled');
			}

			if (this.o.beforeShowMonth !== $.noop){
				var that = this;
				$.each(months, function(i, month){
          var moDate = new Date(year, i, 1);
          var before = that.o.beforeShowMonth(moDate);
					if (before === undefined)
						before = {};
					else if (typeof(before) === 'boolean')
						before = {enabled: before};
					else if (typeof(before) === 'string')
						before = {classes: before};
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

		updateNavArrows: function(){
			if (!this._allow_update)
				return;

			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth();
			switch (this.viewMode){
				case 0:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
				case 2:
				case 3:
				case 4:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() || this.o.maxViewMode < 2){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() || this.o.maxViewMode < 2){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		click: function(e){
			e.preventDefault();
			e.stopPropagation();

			var target, dir, day, year, month, monthChanged, yearChanged;
			target = $(e.target);

			// Clicked on the switch
			if (target.hasClass('datepicker-switch')){
				this.showMode(1);
			}

			// Clicked on prev or next
			var navArrow = target.closest('.prev, .next');
			if (navArrow.length > 0) {
				dir = DPGlobal.modes[this.viewMode].navStep * (navArrow.hasClass('prev') ? -1 : 1);
				if (this.viewMode === 0){
					this.viewDate = this.moveMonth(this.viewDate, dir);
					this._trigger('changeMonth', this.viewDate);
				} else {
					this.viewDate = this.moveYear(this.viewDate, dir);
					if (this.viewMode === 1){
						this._trigger('changeYear', this.viewDate);
					}
				}
				this.fill();
			}

			// Clicked on today button
			if (target.hasClass('today') && !target.hasClass('day')){
				this.showMode(-2);
				this._setDate(UTCToday(), this.o.todayBtn === 'linked' ? null : 'view');
			}

			// Clicked on clear button
			if (target.hasClass('clear')){
				this.clearDates();
			}

			if (!target.hasClass('disabled')){
				// Clicked on a day
				if (target.hasClass('day')){
					day = parseInt(target.text(), 10) || 1;
					year = this.viewDate.getUTCFullYear();
					month = this.viewDate.getUTCMonth();

					// From last month
					if (target.hasClass('old')){
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
						if (month === 11){
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
					if (this.o.minViewMode === 1){
						this._setDate(UTCDate(year, month, day));
						this.showMode();
					} else {
						this.showMode(-1);
					}
					this.fill();
				}

				// Clicked on a year
				if (target.hasClass('year')
						|| target.hasClass('decade')
						|| target.hasClass('century')) {
					this.viewDate.setUTCDate(1);

					day = 1;
					month = 0;
					year = parseInt(target.text(), 10)||0;
					this.viewDate.setUTCFullYear(year);

					if (target.hasClass('year')){
						this._trigger('changeYear', this.viewDate);
						if (this.o.minViewMode === 2){
							this._setDate(UTCDate(year, month, day));
						}
					}
					if (target.hasClass('decade')){
						this._trigger('changeDecade', this.viewDate);
						if (this.o.minViewMode === 3){
							this._setDate(UTCDate(year, month, day));
						}
					}
					if (target.hasClass('century')){
						this._trigger('changeCentury', this.viewDate);
						if (this.o.minViewMode === 4){
							this._setDate(UTCDate(year, month, day));
						}
					}

					this.showMode(-1);
					this.fill();
				}
			}

			if (this.picker.is(':visible') && this._focused_from){
				$(this._focused_from).focus();
			}
			delete this._focused_from;
		},

		_toggle_multidate: function(date){
			var ix = this.dates.contains(date);
			if (!date){
				this.dates.clear();
			}

			if (ix !== -1){
				if (this.o.multidate === true || this.o.multidate > 1 || this.o.toggleActive){
					this.dates.remove(ix);
				}
			} else if (this.o.multidate === false) {
				this.dates.clear();
				this.dates.push(date);
			}
			else {
				this.dates.push(date);
			}

			if (typeof this.o.multidate === 'number')
				while (this.dates.length > this.o.multidate)
					this.dates.remove(0);
		},

		_setDate: function(date, which){
			if (!which || which === 'date')
				this._toggle_multidate(date && new Date(date));
			if (!which || which === 'view')
				this.viewDate = date && new Date(date);

			this.fill();
			this.setValue();
			if (!which || which !== 'view') {
				this._trigger('changeDate');
			}
			if (this.inputField){
				this.inputField.change();
			}
			if (this.o.autoclose && (!which || which === 'date')){
				this.hide();
			}
		},

		moveDay: function(date, dir){
			var newDate = new Date(date);
			newDate.setUTCDate(date.getUTCDate() + dir);

			return newDate;
		},

		moveWeek: function(date, dir){
			return this.moveDay(date, dir * 7);
		},

		moveMonth: function(date, dir){
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
			if (mag === 1){
				test = dir === -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){
						return new_date.getUTCMonth() === month;
					}
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){
						return new_date.getUTCMonth() !== new_month;
					};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			}
			else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i < mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){
					return new_month !== new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		moveAvailableDate: function(date, dir, fn){
			do {
				date = this[fn](date, dir);

				if (!this.dateWithinRange(date))
					return false;

				fn = 'moveDay';
			}
			while (this.dateIsDisabled(date));

			return date;
		},

		weekOfDateIsDisabled: function(date){
			return $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1;
		},

		dateIsDisabled: function(date){
			return (
				this.weekOfDateIsDisabled(date) ||
				$.grep(this.o.datesDisabled, function(d){
					return isUTCEquals(date, d);
				}).length > 0
			);
		},

		dateWithinRange: function(date){
			return date >= this.o.startDate && date <= this.o.endDate;
		},

		keydown: function(e){
			if (!this.picker.is(':visible')){
				if (e.keyCode === 40 || e.keyCode === 27) { // allow down to re-show picker
					this.show();
					e.stopPropagation();
        }
				return;
			}
			var dateChanged = false,
				dir, newViewDate,
				focusDate = this.focusDate || this.viewDate;
			switch (e.keyCode){
				case 27: // escape
					if (this.focusDate){
						this.focusDate = null;
						this.viewDate = this.dates.get(-1) || this.viewDate;
						this.fill();
					}
					else
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
  					if (e.ctrlKey){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');

  						if (newViewDate)
  							this._trigger('changeYear', this.viewDate);
  					}
  					else if (e.shiftKey){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');

  						if (newViewDate)
  							this._trigger('changeMonth', this.viewDate);
  					}
  					else if (e.keyCode === 37 || e.keyCode === 39){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveDay');
  					}
  					else if (!this.weekOfDateIsDisabled(focusDate)){
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
					if (newViewDate){
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
					if (this.picker.is(':visible')){
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
			if (dateChanged){
				if (this.dates.length)
					this._trigger('changeDate');
				else
					this._trigger('clearDate');
				if (this.inputField){
					this.inputField.change();
				}
			}
		},

		showMode: function(dir){
			if (dir){
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

	var DateRangePicker = function(element, options){
		$(element).data('datepicker', this);
		this.element = $(element);
		this.inputs = $.map(options.inputs, function(i){
			return i.jquery ? i[0] : i;
		});
		delete options.inputs;

		datepickerPlugin.call($(this.inputs), options)
			.on('changeDate', $.proxy(this.dateUpdated, this));

		this.pickers = $.map(this.inputs, function(i){
			return $(i).data('datepicker');
		});
		this.updateDates();
	};
	DateRangePicker.prototype = {
		updateDates: function(){
			this.dates = $.map(this.pickers, function(i){
				return i.getUTCDate();
			});
			this.updateRanges();
		},
		updateRanges: function(){
			var range = $.map(this.dates, function(d){
				return d.valueOf();
			});
			$.each(this.pickers, function(i, p){
				p.setRange(range);
			});
		},
		dateUpdated: function(e){
			// `this.updating` is a workaround for preventing infinite recursion
			// between `changeDate` triggering and `setUTCDate` calling.  Until
			// there is a better mechanism.
			if (this.updating)
				return;
			this.updating = true;

			var dp = $(e.target).data('datepicker');

			if (typeof(dp) === "undefined") {
				return;
			}

			var new_date = dp.getUTCDate(),
				i = $.inArray(e.target, this.inputs),
				j = i - 1,
				k = i + 1,
				l = this.inputs.length;
			if (i === -1)
				return;

			$.each(this.pickers, function(i, p){
				if (!p.getUTCDate())
					p.setUTCDate(new_date);
			});

			if (new_date < this.dates[j]){
				// Date being moved earlier/left
				while (j >= 0 && new_date < this.dates[j]){
					this.pickers[j--].setUTCDate(new_date);
				}
			}
			else if (new_date > this.dates[k]){
				// Date being moved later/right
				while (k < l && new_date > this.dates[k]){
					this.pickers[k++].setUTCDate(new_date);
				}
			}
			this.updateDates();

			delete this.updating;
		},
		remove: function(){
			$.map(this.pickers, function(p){ p.remove(); });
			delete this.element.data().datepicker;
		}
	};

	function opts_from_el(el, prefix){
		// Derive options from element data-attrs
		var data = $(el).data(),
			out = {}, inkey,
			replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
		prefix = new RegExp('^' + prefix.toLowerCase());
		function re_lower(_,a){
			return a.toLowerCase();
		}
		for (var key in data)
			if (prefix.test(key)){
				inkey = key.replace(replace, re_lower);
				out[inkey] = data[key];
			}
		return out;
	}

	function opts_from_locale(lang){
		// Derive options from locale plugins
		var out = {};
		// Check if "de-DE" style date is available, if not language should
		// fallback to 2 letter code eg "de"
		if (!dates[lang]){
			lang = lang.split('-')[0];
			if (!dates[lang])
				return;
		}
		var d = dates[lang];
		$.each(locale_opts, function(i,k){
			if (k in d)
				out[k] = d[k];
		});
		return out;
	}

	var old = $.fn.datepicker;
	var datepickerPlugin = function(option){
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function(){
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option === 'object' && option;
			if (!data){
				var elopts = opts_from_el(this, 'date'),
					// Preliminary otions
					xopts = $.extend({}, defaults, elopts, options),
					locopts = opts_from_locale(xopts.language),
					// Options priority: js args, data-attrs, locales, defaults
					opts = $.extend({}, defaults, locopts, elopts, options);
				if ($this.hasClass('input-daterange') || opts.inputs){
					$.extend(opts, {
						inputs: opts.inputs || $this.find('input').toArray()
					});
					data = new DateRangePicker(this, opts);
				}
				else {
					data = new Datepicker(this, opts);
				}
				$this.data('datepicker', data);
			}
			if (typeof option === 'string' && typeof data[option] === 'function'){
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
		isLeapYear: function(year){
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
		},
		getDaysInMonth: function(year, month){
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function')
                return format;
            // IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language, assumeNearby){
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
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)){
				date = new Date();
				for (i=0; i < parts.length; i++){
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

				if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)){
					date = new Date();
				  	for (i=0; i < parts.length; i++){
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

			function applyNearbyYear(year, threshold){
				if (threshold === true)
					threshold = 10;

				// if year is 2 digits or less, than the user most likely is trying to get a recent century
				if (year < 100){
					year += 2000;
					// if the new year is more than threshold years in advance, use last century
					if (year > ((new Date()).getFullYear()+threshold)){
						year -= 100;
					}
				}

				return year;
			}

			var parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){
						return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
					},
					yy: function(d,v){
						return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
					},
					m: function(d,v){
						if (isNaN(d))
							return d;
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() !== v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){
						return d.setUTCDate(v);
					}
				},
				val, filtered;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCToday();
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length !== fparts.length){
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			function match_part(){
				var m = this.slice(0, parts[i].length),
					p = parts[i].slice(0, m.length);
				return m.toLowerCase() === p.toLowerCase();
			}
			if (parts.length === fparts.length){
				var cnt;
				for (i=0, cnt = fparts.length; i < cnt; i++){
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)){
						switch (part){
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
				for (i=0; i < setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s])){
						_date = new Date(date);
						setters_map[s](_date, parsed[s]);
						if (!isNaN(_date))
							date = _date;
					}
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
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
			for (var i=0, cnt = format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
			              '<tr>'+
			                '<th colspan="7" class="datepicker-title"></th>'+
			              '</tr>'+
							'<tr>'+
								'<th class="prev">&laquo;</th>'+
								'<th colspan="5" class="datepicker-switch"></th>'+
								'<th class="next">&raquo;</th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot>'+
							'<tr>'+
								'<th colspan="7" class="today"></th>'+
							'</tr>'+
							'<tr>'+
								'<th colspan="7" class="clear"></th>'+
							'</tr>'+
						'</tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-decades">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-centuries">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;


	/* DATEPICKER NO CONFLICT
	* =================== */

	$.fn.datepicker.noConflict = function(){
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
		function(e){
			var $this = $(this);
			if ($this.data('datepicker'))
				return;
			e.preventDefault();
			// component click requires us to explicitly show it
			datepickerPlugin.call($this, 'show');
		}
	);
	$(function(){
		datepickerPlugin.call($('[data-provide="datepicker-inline"]'));
	});

}));