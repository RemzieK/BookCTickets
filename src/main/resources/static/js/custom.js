(function ($) {
    "use strict";

    $(document).ready(function() {

        $('#js-preloader').addClass('loaded');

        const $moviesContainer = $('#movies-container');
        if ($moviesContainer.length) {
            initializeMovieFiltering();
        }

        const $headerText = $('.header-text');
        if ($headerText.length) {
            $(window).scroll(function() {
                const scroll = $(window).scrollTop();
                const boxHeight = $headerText.height();
                const headerHeight = $('header').height();

                if (scroll >= boxHeight - headerHeight) {
                    $("header").addClass("background-header");
                } else {
                    $("header").removeClass("background-header");
                }
            });
        }

        if ($('.menu-trigger').length){
            $(".menu-trigger").on('click', function() {
                $(this).toggleClass('active');
                $('.header-area .nav').slideToggle(200);
            });
        }
    });

    function initializeMovieFiltering() {
        const $noResults = $('#no-results');

        $('.trending-filter a').on('click', function(e) {
            e.preventDefault();
            const filterValue = $(this).data('filter');

            $('.trending-filter a').removeClass('is_active');
            $(this).addClass('is_active');

            const $items = $('.trending-items');
            if (filterValue === '*') {
                $items.show();
                $noResults.hide();
            } else {
                let foundMatch = false;
                $items.each(function() {
                    const $item = $(this);
                    if ($item.hasClass(filterValue)) {
                        $item.show();
                        foundMatch = true;
                    } else {
                        $item.hide();
                    }
                });
                foundMatch ? $noResults.hide() : $noResults.show();
            }
        });

        $('.search-form').on('submit', function(e) {
            e.preventDefault();
            const searchTerm = $(this).find('input[name="keyword"]').val().toLowerCase().trim();

            const $items = $('.trending-items');
            $items.show();
            $('.trending-filter a').removeClass('is_active');
            $('.trending-filter a[data-filter="*"]').addClass('is_active');

            if (searchTerm) {
                let foundMatch = false;
                $items.each(function() {
                    const $item = $(this);
                    const title = $item.find('h4').text().toLowerCase();
                    const genre = $item.find('.category').text().toLowerCase();

                    if (!title.includes(searchTerm) && !genre.includes(searchTerm)) {
                        $item.hide();
                    } else {
                        foundMatch = true;
                    }
                });
                foundMatch ? $noResults.hide() : $noResults.show();
            } else {
                $noResults.hide();
            }
        });

        $('.search-form input').on('input', function() {
            if ($(this).val().trim() === '') {
                $('.trending-items').show();
                $('.trending-filter a').removeClass('is_active');
                $('.trending-filter a[data-filter="*"]').addClass('is_active');
                $noResults.hide();
            }
        });
    }

})(window.jQuery);
