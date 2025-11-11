(function ($) {
    "use strict";

    $(document).ready(function() {
        $('#js-preloader').addClass('loaded');
        initializeMovieFiltering();
    });

    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      var box = $('.header-text').height();
      var header = $('header').height();

      if (scroll >= box - header) {
        $("header").addClass("background-header");
      } else {
        $("header").removeClass("background-header");
      }
    });

    var width = $(window).width();
    $(window).resize(function() {
        if (width > 767 && $(window).width() < 767) {
            location.reload();
        }
        else if (width < 767 && $(window).width() > 767) {
            location.reload();
        }
    });

    function initializeMovieFiltering() {
        console.log('Checking for movies container...');

        const $moviesContainer = $('#movies-container');
        const $noResults = $('#no-results');

        if (!$moviesContainer.length) {
            console.log('No movies container found - not on movies page');
            return;
        }

        console.log('Movies container found, initializing filtering...');
        console.log('Total movie items:', $('.trending-items').length);

        $('.trending-items').show();
        if ($noResults.length) {
            $noResults.hide();
        }

        $('.trending-filter a').off('click').on('click', function(e) {
            e.preventDefault();

            $('.trending-filter a').removeClass('is_active');

            $(this).addClass('is_active');

            const filterValue = $(this).data('filter');
            console.log('Filtering by:', filterValue);

            $('.trending-items').show();

            if (filterValue !== '*') {
                let foundMatch = false;

                $('.trending-items').each(function() {
                    const $item = $(this);
                    const itemClasses = $item.attr('class') || '';

                    if (!itemClasses.includes(filterValue)) {
                        $item.hide();
                    } else {
                        foundMatch = true;
                    }
                });

                if (!foundMatch) {
                    if ($noResults.length) {
                        $noResults.show();
                    }
                } else {
                    if ($noResults.length) {
                        $noResults.hide();
                    }
                }
            } else {
                if ($noResults.length) {
                    $noResults.hide();
                }
            }
        });

        $('.search-form').off('submit').on('submit', function(e) {
            e.preventDefault();
            const searchTerm = $(this).find('input[name="keyword"]').val().toLowerCase().trim();

            $('.trending-items').show();
            $('.trending-filter a').removeClass('is_active');
            $('.trending-filter a[data-filter="*"]').addClass('is_active');

            if (searchTerm !== '') {
                let foundMatch = false;

                $('.trending-items').each(function() {
                    const $item = $(this);
                    const title = $item.find('h4').text().toLowerCase();
                    const genre = $item.find('.category').text().toLowerCase();

                    if (!title.includes(searchTerm) && !genre.includes(searchTerm)) {
                        $item.hide();
                    } else {
                        foundMatch = true;
                    }
                });

                if (!foundMatch) {
                    if ($noResults.length) {
                        $noResults.show();
                    }
                } else {
                    if ($noResults.length) {
                        $noResults.hide();
                    }
                }
            } else {
                if ($noResults.length) {
                    $noResults.hide();
                }
            }
        });

        $('.search-form input').on('input', function() {
            if ($(this).val().trim() === '') {
                $('.trending-items').show();
                $('.trending-filter a').removeClass('is_active');
                $('.trending-filter a[data-filter="*"]').addClass('is_active');
                if ($noResults.length) {
                    $noResults.hide();
                }
            }
        });

        console.log('Movie filtering initialized successfully');
    }

    if($('.menu-trigger').length){
        $(".menu-trigger").on('click', function() {
            $(this).toggleClass('active');
            $('.header-area .nav').slideToggle(200);
        });
    }

    $('.scroll-to-section a[href*="#"]:not([href="#"])').on('click', function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') &&
            location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                var width = $(window).width();
                if (width < 991) {
                    $('.menu-trigger').removeClass('active');
                    $('.header-area .nav').slideUp(200);
                }
                $('html, body').animate({
                    scrollTop: (target.offset().top) - 80
                }, 700);
                return false;
            }
        }
    });

})(window.jQuery);