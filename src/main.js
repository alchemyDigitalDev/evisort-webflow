import './styles/style.css'
import 'owl.carousel/dist/assets/owl.carousel.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'
import $ from 'jquery'

import 'owl.carousel'

gsap.registerPlugin(ScrollTrigger)

window.onload = function () {
  /*  ==========================================================================
          Debounce function to use for resizes
          ========================================================================== */

  // function debounce(func) {
  //   var timer
  //   return function (event) {
  //     if (timer) clearTimeout(timer)
  //     timer = setTimeout(func, 100, event)
  //   }
  // }

  /*  ==========================================================================
          JS For browser resize to get a vh value that works on mobile - used for mobile nav height
          ========================================================================== */

  // JS to get vh value that works on all browsers & devices
  function resize() {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  window.addEventListener('resize', resize)
  //window.addEventListener('load', resize)

  resize()

  /*  ==========================================================================
          JS to detech touch devices
          ========================================================================== */

  // Re-enable when product features GIF hover is enabled

  function is_touch_enabled() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    )
  }

  /*  ==========================================================================
          Check if element is in view
          ========================================================================== */

  function isScrolledIntoView(elem) {
    let docViewTop = $(window).scrollTop()
    let docViewBottom = docViewTop + $(window).height()

    let elemTop = $(elem).offset().top
    let elemBottom = elemTop + 100

    return elemBottom <= docViewBottom && elemTop >= docViewTop
  }

  /*  ==========================================================================
          Acccordion Module Animation 
          ========================================================================== */

  const accordionItemTime = 7500
  let currentItemID = 1

  function closeAccordionItem(closeItem) {
    $(closeItem).addClass('accordion-item---closed')
    let accordion_loadingbar = $(closeItem).find('.accordion-item-loading-bar')
    let accordion_loadingbarfill = $(closeItem).find(
      '.accordion-item-loading-bar-fill'
    )
    let accordion_content = $(closeItem).find('.accordion-item-content')
    let accordion_mobilequote = $(closeItem).find(
      '.accordion-tile-quote-wrap---mobile'
    )
    let accordion_arrow = $(closeItem).find('.icon-accordion-chevron')

    // Stop animations
    accordion_loadingbar.stop()
    accordion_loadingbarfill.stop()
    accordion_content.stop()
    accordion_mobilequote.stop()
    accordion_arrow.stop()

    // Set all loading bar fills to 0
    $(closeItem).css('backgroundColor', 'transparent')
    $(accordion_loadingbarfill).css('width', '0px')
    $(accordion_content).css('max-height', '0px')
    $(accordion_loadingbar).css('height', '1px')
    $(accordion_loadingbar).css('backgroundColor', 'rgba(0,0,0,0.2)')
    $(accordion_loadingbarfill).css('display', 'none')
    $(accordion_mobilequote).css('max-height', '0px')
    $(accordion_arrow).css('transform', 'none')
  }

  function showAccordionItem(accordion_items, openItem, userClicked = false) {
    // Hide other accordion items
    $(accordion_items)
      .not(openItem)
      .each(function (index, accordion_item) {
        closeAccordionItem(accordion_item)
      })
      .promise()
      .done(function () {
        // Show current one
        $(openItem).removeClass('accordion-item---closed')
        let current_loadingbar = $(openItem).find('.accordion-item-loading-bar')
        let current_loadingbarfill = $(openItem).find(
          '.accordion-item-loading-bar-fill'
        )
        let current_content = $(openItem).find('.accordion-item-content')
        let current_id = $(openItem).data('accordion-id')
        let current_quote = $(openItem)
          .closest('.module---accordion')
          .find(
            '.accordion-tile-quote-wrap---desktop.accordion-tile-quote-wrap-' +
              current_id
          )
        let current_quote_mobile = $(openItem).find(
          '.accordion-tile-quote-wrap---mobile'
        )
        let current_arrow = $(openItem).find('.icon-accordion-chevron')

        currentItemID = current_id

        $(openItem).css('backgroundColor', '#fff9f0')
        $(current_loadingbarfill).css('display', 'block')
        if (
          $(current_loadingbar).hasClass(
            'accordion-item-loading-bar-evisort-red-tint'
          )
        ) {
          $(current_loadingbar).css('backgroundColor', '#ffc1ae')
        } else {
          $(current_loadingbar).css('backgroundColor', '#83a8f8')
        }

        $(current_loadingbar).animate({ height: '10px' }, 100)
        $(current_content).animate({ 'max-height': '750px' }, 750)
        $(current_quote_mobile).animate({ 'max-height': '750px' }, 750)
        $(current_arrow).css('transform', 'rotate(-180deg)')

        // Hide other quotes
        $(openItem)
          .closest('.module---accordion')
          .find('.accordion-tile-quote-wrap---desktop')
          .css('display', 'none')
        // Show this quote
        $(current_quote).css('display', 'block')

        if (userClicked) {
          $(current_loadingbarfill).animate({ width: '100%' }, 0)
        } else {
          $(current_loadingbarfill).animate(
            { width: '100%' },
            accordionItemTime
          )
        }
      })
  }

  function startAccordionAnimation(accordion, screenWidth, itemsTimeout) {
    let accordion_items = $(accordion).find('.accordion-item')

    // Start animation
    $(accordion).addClass('playing')

    if (accordion_items) {
      $(accordion_items).each(function (index, accordion_item) {
        closeAccordionItem(accordion_item)
        let currentTimeoutTime = accordionItemTime * index
        if (screenWidth >= 992) {
          itemsTimeout.push(
            setTimeout(function () {
              showAccordionItem(accordion_items, accordion_item)
            }, currentTimeoutTime)
          )
        }
        $(accordion_item).click(function () {
          // Pause autoplaying timeouts
          for (let i = 0; i < itemsTimeout.length; i++) {
            clearTimeout(itemsTimeout[i])
          }

          showAccordionItem(accordion_items, accordion_item, true)
        })
      })

      if (screenWidth < 992) {
        showAccordionItem(accordion_items, accordion_items[0], true)
      }
    }
  }

  function checkAccordionAnimation(accordion, screenWidth, itemsTimeout) {
    let accordionTop = $(accordion).offset().top - $(window).height()
    let accordionHeight = $(accordion).height()
    let accordionBottom = $(accordion).offset().top + $(accordion).outerHeight()
    let accordion_items = $(accordion).find('.accordion-item')

    // Check if it's in viewport
    if (screenWidth >= 992) {
      if (
        $(window).scrollTop() > accordionTop + accordionHeight * 0.75 &&
        !$(accordion).hasClass('playing')
      ) {
        // Check if it's in viewport
        // Start animation
        $(accordion).addClass('playing')
        if (accordion_items) {
          $(accordion_items).each(function (index, accordion_item) {
            closeAccordionItem(accordion_item)
            let currentTimeoutTime = accordionItemTime * index
            if (screenWidth >= 992) {
              itemsTimeout.push(
                setTimeout(function () {
                  showAccordionItem(accordion_items, accordion_item)
                }, currentTimeoutTime)
              )
            }
            $(accordion_item).click(function () {
              // Pause autoplaying timeouts
              for (let i = 0; i < itemsTimeout.length; i++) {
                clearTimeout(itemsTimeout[i])
              }
              showAccordionItem(accordion_items, accordion_item, true)
            })
          })
        }
      } else if (
        $(window).scrollTop() > accordionBottom &&
        !$(accordion).hasClass('stopped')
      ) {
        $(accordion).addClass('stopped')
        // Pause autoplaying timeouts
        for (let i = 0; i < itemsTimeout.length; i++) {
          clearTimeout(itemsTimeout[i])
        }
        $(accordion_items[currentItemID - 1])
          .find('.accordion-item-loading-bar-fill')
          .stop()
        $(accordion_items[currentItemID - 1])
          .find('.accordion-item-loading-bar-fill')
          .css('width', '100%')
      }
    }
  }

  function accordionsInit() {
    const accordions = $('.module---accordion .grid')
    let screenWidth = window.innerWidth
    let itemsTimeout = []

    if (accordions) {
      $(accordions).each(function (index, accordion) {
        // Start accordion animation
        $(window).on('scroll', function () {
          checkAccordionAnimation(accordion, screenWidth, itemsTimeout)
        })
        startAccordionAnimation(accordion, screenWidth, itemsTimeout)
      })
    }

    $(window).on('resize', function () {
      screenWidth = window.innerWidth
      $(accordions).each(function (index, accordion) {
        if ($(accordion).hasClass('playing') && screenWidth < 992) {
          // if resizing down to mobile, then pause animation and show current
          for (let i = 0; i < itemsTimeout.length; i++) {
            clearTimeout(itemsTimeout[i])
          }

          $('.accordion-item-loading-bar-fill').stop()
          $('.accordion-item-loading-bar-fill').css('width', '0px')

          let accordion_items = $(accordion).find('.accordion-item')

          showAccordionItem(
            accordion_items,
            accordion_items[currentItemID - 1],
            true
          )
        }
      })
    })
  }

  //window.addEventListener('load', accordionsInit)
  accordionsInit()

  /*  ==========================================================================
          Alternating text animation 
          ========================================================================== */

  function alternatingTextAnimate(count, maxCount) {
    $('.pageheader-heading__alternatingtext__item--' + count).animate(
      {
        opacity: '0',
      },
      { duration: 900, queue: false }
    )

    $('.pageheader-heading__alternatingtext__item--' + count).css(
      'display',
      'none'
    )

    count++
    if (count > maxCount) {
      count = 1
    }

    $('.pageheader-heading__alternatingtext__item--' + count).css(
      'display',
      'inline'
    )

    $('.pageheader-heading__alternatingtext__item--' + count).animate(
      {
        opacity: '1',
      },
      { duration: 900, queue: false }
    )

    window.setTimeout(function () {
      alternatingTextAnimate(count, maxCount)
    }, 3000)
  }

  function alternatingTextInit() {
    let pageHeadings = $('.pageheader-heading')
    if (pageHeadings) {
      $(pageHeadings).each(function (index, pageHeading) {
        let pageHeadingText = $(pageHeading).text()
        let pageHeadingTextToReplace = $(pageHeading).data('replacetext')
        let pageHeadingTextStrings = pageHeadingText.split(
          pageHeadingTextToReplace
        )
        let alternatingTextWords = $(pageHeading).data('alternatingtext')
        if (alternatingTextWords) {
          let alternatingTextArray = alternatingTextWords.split('*')
          alternatingTextArray = alternatingTextArray.filter(function (el) {
            return el != ''
          })
          if (alternatingTextArray) {
            if (pageHeadingTextStrings[1]) {
              $(pageHeading).html(
                pageHeadingTextStrings[0] +
                  ' <span class="pageheader-heading__alternatingtext"></span> ' +
                  pageHeadingTextStrings[1]
              )
            } else {
              $(pageHeading).html(
                pageHeadingTextStrings[0] +
                  ' <span class="pageheader-heading__alternatingtext"></span> '
              )
            }

            $(alternatingTextArray).each(function (
              index,
              alternatingTextArrayItem
            ) {
              let itemCountNo = index + 1
              $(pageHeading)
                .find('.pageheader-heading__alternatingtext')
                .append(
                  '<span class="pageheader-heading__alternatingtext__item pageheader-heading__alternatingtext__item--' +
                    itemCountNo +
                    '">' +
                    alternatingTextArrayItem +
                    '</span>'
                )
            })
          }

          window.setTimeout(function () {
            $(pageHeading).addClass('loaded')
          }, 500)

          alternatingTextAnimate(0, alternatingTextArray.length)
        }
      })
    }
  }

  //window.addEventListener('load', alternatingTextInit)
  alternatingTextInit()

  /*  ==========================================================================
          Statistics animations
          ========================================================================== */

  function statisticsInit() {
    let statisticModules = $('.module---statistics')

    $(statisticModules).each(function () {
      // Setup items ready for animation
      $(this)
        .find('.counter')
        .each(function () {
          $(this).data('counter', $(this).text())
          $(this).text(0)
        })
    })

    animateStatistics(statisticModules)

    $(window).scroll(function () {
      // Trigger animations on scroll
      animateStatistics(statisticModules)
    })
  }

  function animateStatistics(statisticModules) {
    $(statisticModules).each(function () {
      if (isScrolledIntoView($(this)) && !$(this).hasClass('loaded')) {
        $(this).addClass('loaded')
        $(this)
          .find('.counter')
          .each(function () {
            $(this)
              .prop('Counter', 0)
              .animate(
                {
                  Counter: $(this).data('counter'),
                },
                {
                  duration: 2000,
                  easing: 'swing',
                  step: function (now) {
                    $(this).text(Math.ceil(now))
                  },
                }
              )
          })
        // First stat SVG animation
        let statPercentage = $(this)
          .find('.statistic-animation-wrap---1')
          .find('.counter')
          .data('counter')
        let strokeOffset = 100 - parseInt(statPercentage)
        if (strokeOffset < 10) {
          strokeOffset = 10
        }
        $(this)
          .find('.statistic-animation-wrap---1')
          .find('.circle-fill')
          .animate({ 'stroke-dashoffset': strokeOffset }, 2000)

        // Second stat SVG animation
        $(this)
          .find('.statistic-animation-wrap---2')
          .find('.dot-1')
          .animate(
            {
              opacity: 1,
            },
            {
              step: function (now) {
                $(this).css('transform', 'scale(' + now + ')')
              },
              duration: 1000,
            }
          )
        $(this)
          .find('.statistic-animation-wrap---2')
          .find('.dot-2')
          .delay(400)
          .animate(
            {
              opacity: 1,
            },
            {
              step: function (now) {
                $(this).css('transform', 'scale(' + now + ')')
              },
              duration: 1000,
            }
          )
        $(this)
          .find('.statistic-animation-wrap---2')
          .find('.dot-3')
          .delay(800)
          .animate(
            {
              opacity: 1,
            },
            {
              step: function (now) {
                $(this).css('transform', 'scale(' + now + ')')
              },
              duration: 1000,
            }
          )
        // Thirds stat SVG animation
        $(this)
          .find('.statistic-animation-wrap---3')
          .find('.fill-1')
          .animate({ 'stroke-dashoffset': '0' }, 1000)
        $(this)
          .find('.statistic-animation-wrap---3')
          .find('.fill-2')
          .animate({ 'stroke-dashoffset': '30' }, 1000)
        $(this)
          .find('.statistic-animation-wrap---3')
          .find('.fill-3')
          .animate({ 'stroke-dashoffset': '65' }, 1000)
      }
    })
  }

  //window.addEventListener('load', statisticsInit)
  statisticsInit()

  /*  ==========================================================================
          Product Feature hover animations
          ========================================================================== */

  function productFeaturesInit() {
    let productFeaturesModules = $('.module---product-features')

    if (productFeaturesModules) {
      $(productFeaturesModules).each(function () {
        let featureTiles = $('.tile-icon---product-features')
        if (featureTiles) {
          $(featureTiles).each(function () {
            let gifImageWrap = $(this).find('.tile-hover-gif')

            // Disabled for now, as client is currently using static images - can be re-enabled when gifs are added.

            // let gifImage = $(this).find('.tile-hover-gif-image')
            // let gifImageSRC = $(gifImage).attr('src')
            // // Setup image src as data attribute
            // $(gifImage).data('gif-image', gifImageSRC)
            // // Set image src to blank to star with
            // $(gifImage).attr('src', '')
            // if (!is_touch_enabled()) {
            //   $(this).hover(
            //     function () {
            //       // on hover set the image src back to the GIF to make it play
            //       $(gifImageWrap).show()
            //       $(gifImage).attr(
            //         'src',
            //         gifImageSRC + '?rnd=' + Math.random() + ''
            //       )
            //     },
            //     function () {
            //       $(gifImageWrap).hide()
            //       $(gifImage).attr('src', '')
            //     }
            //   )
            // }

            // Temporary static version...
            if (!is_touch_enabled()) {
              $(this).hover(
                function () {
                  // on hover set the image src back to the GIF to make it play
                  $(gifImageWrap).fadeIn(250)
                },
                function () {
                  $(gifImageWrap).fadeOut(250)
                }
              )
            }
          })
        }
      })
    }
  }

  //window.addEventListener('load', productFeaturesInit)
  productFeaturesInit()

  /*  ==========================================================================
          Underline header animations
          ========================================================================== */

  function animateUnderlines(headingUnderlines) {
    $(headingUnderlines).each(function () {
      let headingUnderlineContent = $(this).data('underline')
      let headingContent = $(this).text()
      if (headingContent.includes(headingUnderlineContent)) {
        if (isScrolledIntoView($(this)) && !$(this).hasClass('loaded')) {
          $(this).addClass('loaded')
        }
      }
    })
  }

  function underlineAnimInit() {
    let headingUnderlines = $('[data-underline]')
    if (headingUnderlines) {
      $(headingUnderlines).each(function () {
        let headingUnderlineContent = $(this).data('underline')
        let headingContent = $(this).text()
        if (headingContent.includes(headingUnderlineContent)) {
          let headingContentStrings = headingContent.split(
            headingUnderlineContent,
            2
          )
          $(this).html(
            headingContentStrings[0] +
              '<span class="headingunderline">' +
              headingUnderlineContent +
              '</span>' +
              headingContentStrings[1]
          )
          animateUnderlines(headingUnderlines)
          $(window).scroll(function () {
            // Trigger animations on scroll
            animateUnderlines(headingUnderlines)
          })
        }
      })
    }
  }

  //window.addEventListener('load', underlineAnimInit)
  underlineAnimInit()

  /*  ==========================================================================
          Careers - Get Jobs from Lever
          ========================================================================== */

  function groupJobsByDepartment(list) {
    return list.reduce((acc, item) => {
      let text = item.text
      let hostedUrl = item.hostedUrl
      let applyUrl = item.applyUrl
      let department = item && item.categories ? item.categories.department : ''
      let location = item && item.categories ? item.categories.location : ''

      acc[department] = [
        ...(acc[department] || []),
        {
          text,
          location,
          hostedUrl,
          applyUrl,
        },
      ]
      return acc
    }, {})
  }

  function listHTML(name, list) {
    let itemHTML = '<div class="career-department">'
    itemHTML += '<h3 class="department-heading heading-3">' + name + '</h3>'

    itemHTML += '<div class="career-listitems">'
    for (let i = 0; i < list.length; i++) {
      itemHTML += '<div class="career-item">'
      itemHTML +=
        '<a class="career-title" target="_blank" href="' +
        list[i].hostedUrl +
        '" rel="noopener noreferrer">'
      itemHTML +=
        list[i].text.indexOf('(') > -1
          ? list[i].text.substring(0, list[i].text.indexOf('('))
          : list[i].text
      itemHTML += '</a>'
      itemHTML += '<div class="career-info">'
      itemHTML += '<div class="career-location">'
      itemHTML += '<div>' + list[i].location + '</div>'
      itemHTML += '</div>'
      itemHTML +=
        '<a class="button button---primary" target="_blank" href="' +
        list[i].applyUrl +
        '" rel="noopener noreferrer">Apply</a>'
      itemHTML += '</div>'
      itemHTML += '</div>'
    }
    itemHTML += '</div>'

    itemHTML += '</div>'

    return itemHTML
  }
  $.ajax({
    url: 'https://api.lever.co/v0/postings/evisort-2',
    data: {
      skip: 0,
      limit: 1000,
      mode: 'json',
    },
    success: function (jobPosts) {
      let postionsGroupByDepartment = groupJobsByDepartment(jobPosts)
      let departmentNames = Object.keys(postionsGroupByDepartment).sort(
        (a, b) => (a > b ? 1 : -1)
      )
      let list = ''
      for (let i = 0; i < departmentNames.length; i++) {
        list += listHTML(
          departmentNames[i],
          postionsGroupByDepartment[departmentNames[i]]
        )
      }
      $('.careers-list').html(list)
    },
  })

  /*  ==========================================================================
          Quotes Carousel
          ========================================================================== */

  function quoteCarouselsInit() {
    let quoteCarousels = $('.quotes-carousel')
    if (quoteCarousels) {
      $(quoteCarousels).each(function () {
        $(this).owlCarousel({
          items: 1,
          margin: 48,
          nav: true,
          navText: [
            "<span class='owl-nav__icon'></span>",
            "<span class='owl-nav__icon'></span>",
          ],
          dots: true,
          loop: true,
          autoHeight: false,
          // autoplay: true,
          // autoplayTimeout: 10000,
          onInitialized: quoteCustomPage($(this)),
          responsive: {
            0: {
              margin: 16,
            },
            767: {
              margin: 24,
            },
            1280: {
              margin: 48,
            },
          },
        })
      })
    }
  }

  function quoteCustomPage(this_owl) {
    $(window).scroll(function () {
      // Trigger carousel autoplay on scroll (e.g. once carousel is in view)
      let carouselTop = $(this_owl).offset().top - $(window).height()
      let carouselHeight = $(this_owl).height()
      if ($(window).scrollTop() > carouselTop + carouselHeight) {
        setTimeout(function () {
          if (!$(this_owl).hasClass('playing')) {
            console.log('play carousel')
            this_owl.trigger('play.owl.autoplay', 10000)
            $(this_owl).addClass('playing')
          }
        }, 200)
      }
    })
    setTimeout(function () {
      var dots = $(this_owl).find('.owl-dot')
      $(dots).each(function (i) {
        var paginationLinks = $('.owl-dots .owl-dot')
        var owlItems = $('.owl-item:not(.cloned)')
        var dotItem = owlItems[i]
        var dotItemTitle = $(dotItem)
          .find('.quote-item')
          .find('.module-header .heading-2')
          .html()
        $(paginationLinks[i]).prop('title', 'Carousel Next: ' + dotItemTitle)
        $(paginationLinks[i]).html(
          '<span class="owl-dot__progress"><span class="owl-dot__progressbar"></span></span><span class="owl-dot__title">' +
            dotItemTitle +
            '</span>'
        )
      })
    }, 100)
  }

  quoteCarouselsInit()

  /*  ==========================================================================
          Tile Carousel
          ========================================================================== */

  function tileCarouselsInit() {
    let tileCarousels = $('.tiles-carousel')
    if (tileCarousels) {
      $(tileCarousels).each(function () {
        $(this).owlCarousel({
          items: 1,
          margin: 48,
          nav: true,
          navText: [
            "<span class='owl-nav__icon'></span>",
            "<span class='owl-nav__icon'></span>",
          ],
          dots: true,
          loop: true,
          autoHeight: true,
          onInitialized: customPager($(this)),
          responsive: {
            0: {
              margin: 16,
            },
            767: {
              margin: 24,
            },
            1280: {
              margin: 48,
            },
          },
        })
      })
    }
  }

  function customPager(this_owl) {
    setTimeout(function () {
      var dots = $(this_owl).find('.owl-dot')
      $(dots).each(function (i) {
        var paginationLinks = $('.owl-dots .owl-dot')
        var number = i + 1
        $(paginationLinks[i]).prop('title', 'Carousel Next Image ' + number)
      })
    }, 100)
  }

  //window.addEventListener('load', tileCarouselsInit)
  tileCarouselsInit()

  /*  ==========================================================================
          Pinned Slides Module
          ========================================================================== */

  // function pinnedScrollResize(pinnedScrollModule, pinnedSlides) {
  //   if (window.innerWidth > 768) {
  //     let biggestSlide = 0

  //     // Set slides back to auto height so we can detect the natural heights
  //     pinnedSlides.forEach(function (slide) {
  //       slide.style.minHeight = 'auto'
  //     })
  //     setTimeout(function () {
  //       pinnedSlides.forEach(function (slide) {
  //         // check if each slide is bigger than others
  //         biggestSlide =
  //           slide.offsetHeight > biggestSlide
  //             ? slide.offsetHeight
  //             : biggestSlide
  //         // Now we have the biggest height, make the slides all 100% - if we do this before then we cant get the biggest height
  //         slide.style.minHeight = '100%'
  //       })

  //       pinnedScrollModule.querySelector('.pinned-slides').style.height =
  //         biggestSlide + 'px'
  //     }, 100)
  //   } else {
  //     pinnedScrollModule.querySelector('.pinned-slides').style.height = 'auto'
  //   }
  // }

  // function pinnedScrollInit() {
  //   const pinnedScrollModules = document.querySelectorAll(
  //     '.module---pinned-slides'
  //   )

  //   if (!pinnedScrollModules) {
  //     return
  //   }

  //   pinnedScrollModules.forEach(function (elem) {
  //     let pinnedSlides = elem.querySelectorAll('.pinned-slide')
  //     let pinnedSlidesWrap = elem.querySelector('.pinned-slides')
  //     let biggestSlide = 0
  //     pinnedSlides.forEach(function (slide, i) {
  //       biggestSlide =
  //         slide.querySelector('.flex-grid-item:first-child').offsetHeight >
  //         biggestSlide
  //           ? slide.querySelector('.flex-grid-item:first-child').offsetHeight
  //           : biggestSlide
  //       /* Now we have the biggest height, make the slides all 100% - if we do this before then we cant get the biggest height */
  //       slide.style.minHeight = '100%'

  //       // Add slide dots
  //       let slideDotsHtml = ''
  //       pinnedSlides.forEach(function (slide, j) {
  //         if (i == j) {
  //           slideDotsHtml += "<div class='pinned-slide-dot active'></div>"
  //         } else {
  //           slideDotsHtml += "<div class='pinned-slide-dot'></div>"
  //         }
  //       })
  //       slide.querySelector('.pinned-slide-content').innerHTML +=
  //         "<div class='pinned-slide-dots'>" + slideDotsHtml + '</div>'

  //       // for each slide append a dot to dots div
  //     })

  //     elem.querySelector('.pinned-slides').style.height = biggestSlide + 'px'

  //     ScrollTrigger.matchMedia({
  //       // desktop
  //       '(min-width: 768px)': function () {
  //         // Remove carousel if enabled
  //         $(pinnedSlidesWrap).trigger('destroy.owl.carousel')
  //         pinnedSlidesWrap.classList.remove('owl-carousel')

  //         let endPoint = pinnedSlides.length * 500

  //         // Setup pinned scroll...
  //         const tl = gsap.timeline({
  //           scrollTrigger: {
  //             trigger: elem.querySelector('.pinned-trigger'),
  //             pin: true,
  //             markers: false, // only enable for debugging
  //             scrub: 1,
  //             start: '50% 50%',
  //             end: '+=' + endPoint,
  //             toggleActions: 'play pause play reset',
  //             invalidateOnRefresh: true,
  //           },
  //         })

  //         pinnedSlides.forEach((elem, i) => {
  //           if (i == 0) {
  //             tl.to(elem, {
  //               opacity: 1,
  //               duration: 1,
  //             }).set(elem, { css: { zIndex: 100 } })
  //           } else {
  //             tl.to(elem, {
  //               opacity: 1,
  //               duration: 1,
  //             }).set(elem, { css: { zIndex: 100 } })
  //           }

  //           tl.to(elem.querySelector('.pinned-scroll-image-wrap'), {
  //             opacity: 1,
  //             scale: 1,
  //             duration: 1,
  //           })
  //           if (i < pinnedSlides.length - 1) {
  //             tl.to(
  //               elem.querySelector('.pinned-scroll-image-wrap'),
  //               {
  //                 opacity: 0,
  //                 duration: 1,
  //               },
  //               '+=20'
  //             )
  //           } else {
  //             tl.to(
  //               elem.querySelector('.pinned-scroll-image-wrap'),
  //               {
  //                 duration: 1,
  //               },
  //               '+=20'
  //             )
  //           }
  //         })
  //       },
  //       '(max-width: 768px)': function () {
  //         // Setup Owl Carousel
  //         pinnedSlidesWrap.classList.add('owl-carousel')
  //         $(pinnedSlidesWrap).owlCarousel({
  //           items: 1,
  //           margin: 48,
  //           nav: false,
  //           dots: false,
  //           loop: false,
  //           autoHeight: true,
  //           responsive: {
  //             0: {
  //               margin: 10,
  //             },
  //             767: {
  //               margin: 24,
  //             },
  //             1280: {
  //               margin: 48,
  //             },
  //           },
  //         })
  //       },
  //     })

  //     pinnedScrollResize(elem, pinnedSlides)

  //     window.addEventListener(
  //       'resize',
  //       debounce(function () {
  //         pinnedScrollResize(elem, pinnedSlides)
  //       })
  //     )
  //   })
  // } // pinnedScrollInit();

  // pinnedScrollInit()

  /*  ==========================================================================
          Glossary Links
          ========================================================================== */

  function glossaryLinksInit() {
    let glossaryLinks = $('.module---single-page a[href*="/glossary/"]')
    if (glossaryLinks) {
      $(glossaryLinks).each(function () {
        $(this).addClass('glossary-link')
        $(this).wrapInner('<span class="glossary-link__text"></span>')
        $(this).append('<span class="glossary-link__icon"></span>')
      })
    }
  }

  //window.addEventListener('load', glossaryLinksInit)
  glossaryLinksInit()

  /*  ==========================================================================
          Resource access forms
          ========================================================================== */

  // eslint-disable-next-line no-unused-vars
  function createCookie(name, value, days) {
    var expires
    if (days) {
      var date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      expires = '; expires=' + date.toGMTString()
    } else {
      expires = ''
    }
    document.cookie = name + '=' + value + expires + '; path=/'
  }

  // eslint-disable-next-line no-unused-vars
  function getCookie(c_name) {
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + '=')
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1
        let c_end = document.cookie.indexOf(';', c_start)
        if (c_end == -1) {
          c_end = document.cookie.length
        }
        return unescape(document.cookie.substring(c_start, c_end))
      }
    }
    return ''
  }

  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[[\]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }

  const resourceFolder = 'resource'

  function checkResourceAccess() {
    if (window.location.href.indexOf('/' + resourceFolder + '/') > -1) {
      // check if it has a gated area e.g. if its a gated resource
      if ($('.is-gated-resource').val() == 'true') {
        let resourceSlug = document.querySelector('.resource-slug').value
        let resourceAccessCookie = getCookie('evisort-resource-access')
        if (getParameterByName('access')) {
          if (resourceAccessCookie) {
            resourceAccessCookie = JSON.parse(resourceAccessCookie)
            if (!resourceAccessCookie.includes(resourceSlug)) {
              resourceAccessCookie.push(resourceSlug)
            }
          } else {
            resourceAccessCookie = [resourceSlug]
          }
          let resourceAccessStr = JSON.stringify(resourceAccessCookie)
          createCookie('evisort-resource-access', resourceAccessStr)
          // update url rather redirect
          window.history.replaceState(
            {},
            document.title,
            '/' + resourceFolder + '/' + resourceSlug
          )
          $('.resource-ungated').removeClass('w-condition-invisible')
          $('.resource-gate').remove()
        } else if (resourceAccessCookie) {
          resourceAccessCookie = JSON.parse(resourceAccessCookie)
          if (!resourceAccessCookie.includes(resourceSlug)) {
            // user does not have access... hide content & show form
            $('.resource-gate').show()
            $('.resource-ungated').remove()
          } else {
            $('.resource-ungated').removeClass('w-condition-invisible')
            $('.resource-gate').remove()
          }
        } else {
          // No cookie, so user does not have access... redirect them back to the resource page
          $('.resource-gate').show()
          $('.resource-ungated').remove()
        }
      } else {
        // This resource is ungated - so show content
        $('.resource-ungated').removeClass('w-condition-invisible')
        $('.resource-gate').remove()
      }
    }
  }

  //window.addEventListener('load', checkResourceAccess)
  checkResourceAccess()

  /*  ==========================================================================
          Resource access forms
          ========================================================================== */

  function createGlossaryGrid() {
    if (document.querySelector('.hidden-glossary-list')) {
      let glossaryArray = {}
      let glossaryLinks = document
        .querySelector('.hidden-glossary-list')
        .querySelectorAll('.glossary-link')
      glossaryLinks.forEach(function (glossaryLink) {
        let firstLetter = glossaryLink
          .querySelector('.first-letter')
          .value.toLowerCase()
        if (glossaryArray[firstLetter] == undefined) {
          glossaryArray[firstLetter] = []
        }
        glossaryArray[firstLetter].push(glossaryLink.outerHTML)
      })

      for (let key in glossaryArray) {
        let letterList = document.querySelectorAll(
          ".glossary-list-list[data-letter='" + key + "']"
        )
        if (glossaryArray[key].length && letterList.length) {
          for (let itemKey in glossaryArray[key]) {
            letterList[0].innerHTML +=
              '<div class="glossary-item">' +
              glossaryArray[key][itemKey] +
              '</div>'
          }
        }
      }
    }
  }

  //window.addEventListener('load', createGlossaryGrid)
  createGlossaryGrid()

  /*  ==========================================================================
          Marquee - Infinite Scroll
          ========================================================================== */

  const default_animation_speed = 1.5
  const el_class = 'marquee---animating'
  const inner_class = 'marquee__wrap'

  function marquee__resize($el) {
    // Check if element has custom speed or default
    var animation_speed = default_animation_speed
    if ($el.data('speed')) {
      animation_speed = $el.data('speed')
    } else {
      animation_speed = default_animation_speed
    }

    // Set animation time
    var linelength = $('.' + inner_class, $el).width()
    var distance = linelength
    var speed = animation_speed * 0.01
    var duration = distance / speed
    var delay = 0 - duration / 3

    $el.find('.' + inner_class).css('animation-duration', duration + 'ms')
    $el
      .find('.' + inner_class + ':first-child()')
      .css('animation-delay', delay + 'ms')
    $el
      .find('.' + inner_class + ':nth-child(2)')
      .css('animation-delay', delay * 2 + 'ms')
    $el
      .find('.' + inner_class + ':nth-child(3)')
      .css('animation-delay', delay * 3 + 'ms')
    // $el
    //   .find('.' + inner_class + ':nth-child(4)')
    //   .css('animation-delay', delay * 4 + 'ms')
    // $el
    //   .find('.' + inner_class + ':nth-child(5)')
    //   .css('animation-delay', delay * 5 + 'ms')
  }

  function marquee__init($el) {
    // Setup two scroll wraps (duplicate the HTML)
    $el.wrapInner("<div class='" + inner_class + "'></div>")
    $el
      .find('.' + inner_class)
      .clone()
      .appendTo($el)
    $el
      .find('.' + inner_class + ':first-child()')
      .clone()
      .appendTo($el)
    // $el
    //   .find('.' + inner_class + ':first-child()')
    //   .clone()
    //   .appendTo($el)

    // Setup animation times
    marquee__resize($el)

    // Once everything is set up, add "loaded" class
    $el.addClass(el_class + '--loaded')
  }

  function setupMarquee() {
    $('.' + el_class).each(function () {
      marquee__init($(this))
    })
    $(window).resize(function () {
      $('.' + el_class).each(function () {
        marquee__resize($(this))
      })
    })
  }

  //window.addEventListener('load', setupMarquee)
  setupMarquee()

  function ctaColourChangeInit() {
    if ($('.navbar-wrapper .button-outline.button-light').length) {
      if ($(window).scrollTop() > 50) {
        $('.navbar-wrapper .button-outline.button-light').addClass('highlight')
      } else {
        $('.navbar-wrapper .button-outline.button-light').removeClass(
          'highlight'
        )
      }
    }
  }

  $(window).scroll(function () {
    // Trigger animations on scroll
    ctaColourChangeInit()
  })

  /*  ==========================================================================
      Sort button unactive classes - as jetboost doesnt do this as default 
      ========================================================================== */

  $('.filter-sort-dropdown-item').click(function () {
    if ($(this).hasClass('alchemy-active')) {
      $('.filter-sort-dropdown-item').addClass('alchemy-active')
      $(this).removeClass('alchemy-active')
    } else {
      $('.filter-sort-dropdown-item').removeClass('alchemy-active')
      $(this).addClass('alchemy-active')
    }
  })

  function checkforactivesort() {
    if ($('.filter-sort-dropdown-item.jetboost-sort-active').length) {
      $('.filter-sort-dropdown-item').removeClass('alchemy-active')
      $('.filter-sort-dropdown-item.jetboost-sort-active').addClass(
        'alchemy-active'
      )
    }
  }

  checkforactivesort()
}

/*  ==========================================================================
          Accessibility Title attribute
          ========================================================================== */

function accessibilityTitlesInit() {
  let tiles = $('.tile')

  if (tiles) {
    $(tiles).each(function () {
      var tile = $(this)
      // For accessibility grab the Headings and apply as titles on the links
      let title = ''
      let tileContentHeading = $(tile).find('.tile-content-heading')
      let tileVerticalHeading = $(tile).find('.tile-small-vertical-heading')

      if ($(tileContentHeading).length > 0) {
        title = $(tile).find('.tile-content-heading').text()
      } else if ($(tileVerticalHeading).length > 0) {
        title = $(tile).find('.tile-small-vertical-heading').text()
      }

      if (title) {
        let tileLink = $(tile).find('.tile-cover-link')
        if ($(tileLink).attr('href') != '' && $(tileLink).attr('href') != '#') {
          $(tileLink).prop('title', 'Read more about ' + title)
        }
      }
    })
  }

  let listGridItems = $('.logo-grid-item')

  if (listGridItems) {
    $(listGridItems).each(function () {
      var listGridItem = $(this)
      // For accessibility grab the Headings and apply as titles on the links
      let listGridImageAlt = $(listGridItem)
        .find('.logo-grid-image')
        .attr('alt')

      if (listGridImageAlt) {
        let listGridItemLink = $(listGridItem).find('.link-block')

        if (
          $(listGridItemLink).attr('href') != '' &&
          $(listGridItemLink).attr('href') != '#'
        ) {
          $(listGridItemLink).prop(
            'title',
            'Read more about ' + listGridImageAlt
          )
        }
      }
    })
  }
}

//window.addEventListener('load', accessibilityTitlesInit)
accessibilityTitlesInit()
