/*
    Arcana by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

    var $window = $(window),
        $body = $('body');

    // Breakpoints.
        breakpoints({
            wide:      [ '1281px',  '1680px' ],
            normal:    [ '981px',   '1280px' ],
            narrow:    [ '841px',   '980px'  ],
            narrower:  [ '737px',   '840px'  ],
            mobile:    [ '481px',   '736px'  ],
            mobilep:   [ null,      '480px'  ]
        });

    // Play initial animations on page load.
        $window.on('load', function() {
            window.setTimeout(function() {
                $body.removeClass('is-preload');
            }, 100);
        });

    // Dropdowns.
        $('#nav > ul').dropotron({
            offsetY: -15,
            hoverDelay: 0,
            alignment: 'center'
        });

    // Nav.

        // Bar.
            $(
                '<div id="titleBar">' +
                    '<a href="#navPanel" class="toggle"></a>' +
                    '<span class="title" style="text-align:center;">' + $('#logo').html() +
                    '</span>' + 
                '</div>'
            )
                .appendTo($body);

        // Panel.
            $(
                '<div id="navPanel">' +
                    '<nav>' +
                        $('#nav').navList() +
                    '</nav>' + 
                    //'<br>' + '<button id="search-input" style="min-width:2em;">Search</button>' +
                    /*`<h4 style="font-size: 1.5em; margin-top: 1em;">News & Events</h4>
                    <nav class="links">
                        <a class="link depth-0" href="/content/lord-of-the-orings">LORD OF THE ORINGS (CVE-2022-3203): Vulnerability Analysis of an Industrial Access Point</a> 
                        <a class="link depth-0" href="#">New members of the MADS lab</a>
                        <a class="link depth-0" href="#">We are hiring! Two fellowship grants within the “IT MATTERS” project</a>
                        <a class="link depth-0" href="#">“Easter’s Eve”: new version of jLibBig released</a>
                        <a class="link depth-0" href="#">IT MATTERS starts!</a>
                    </nav>` +*/
                    //'<script src="search.js"></script>' +
                    `<style>
                    ::-moz-placeholder {
                        color: #fff;
                        font-weight: 550;
                    }
                    </style>` +
                    `<form  id="search-form" action="/search" method="get">
                    <input class="blackbarMobile" type="text" id="search-input" name="query" placeholder="🔍  Search..." style="width: 100%; height:50px;">
                    </form>` +
                '</div>'
            )
                .appendTo($body)
                .panel({
                    delay: 500,
                    hideOnClick: true,
                    hideOnSwipe: true,
                    resetScroll: true,
                    resetForms: true,
                    side: 'left',
                    target: $body,
                    visibleClass: 'navPanel-visible'
                });

})(jQuery);
