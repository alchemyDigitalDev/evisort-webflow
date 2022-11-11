import './styles/style.css'

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
window.addEventListener('load', resize)

/*  ==========================================================================
    Check if element is in view
    ========================================================================== */

function isScrolledIntoView(elem) {
  var docViewTop = $(window).scrollTop()
  var docViewBottom = docViewTop + $(window).height()

  var elemTop = $(elem).offset().top
  var elemBottom = elemTop + 100

  return elemBottom <= docViewBottom && elemTop >= docViewTop
}

/*  ==========================================================================
    Acccordion Module Animation 
    ========================================================================== */

const accordionItemTime = 5000
let currentItemID = 1

function closeAccordionItem(closeItem) {
  var accordion_loadingbar = $(closeItem).find('.accordion-item-loading-bar')
  var accordion_loadingbarfill = $(closeItem).find(
    '.accordion-item-loading-bar-fill'
  )
  var accordion_content = $(closeItem).find('.accordion-item-content')
  var accordion_mobilequote = $(closeItem).find(
    '.accordion-tile-quote-wrap---mobile'
  )
  var accordion_arrow = $(closeItem).find('.icon-accordion-chevron')

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
      var current_loadingbar = $(openItem).find('.accordion-item-loading-bar')
      var current_loadingbarfill = $(openItem).find(
        '.accordion-item-loading-bar-fill'
      )
      var current_content = $(openItem).find('.accordion-item-content')
      var current_id = $(openItem).data('accordion-id')
      var current_quote = $(openItem)
        .closest('.module---accordion')
        .find(
          '.accordion-tile-quote-wrap---desktop.accordion-tile-quote-wrap-' +
            current_id
        )
      var current_quote_mobile = $(openItem).find(
        '.accordion-tile-quote-wrap---mobile'
      )
      var current_arrow = $(openItem).find('.icon-accordion-chevron')

      currentItemID = current_id

      $(openItem).css('backgroundColor', '#fff9f0')
      $(current_loadingbarfill).css('display', 'block')
      $(current_loadingbar).css('backgroundColor', '#83a8f8')
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
        $(current_loadingbarfill).animate({ width: '100%' }, accordionItemTime)
      }
    })
}

function startAccordionAnimation(accordion, screenWidth, itemsTimeout) {
  var accordionTop = $(accordion).offset().top - $(window).height()
  var accordionBottom = $(accordion).offset().top + $(accordion).outerHeight()
  var accordion_items = $(accordion).find('.accordion-item')

  if (
    $(window).scrollTop() > accordionTop &&
    !$(accordion).hasClass('playing')
  ) {
    // Check if it's in viewport
    // Start animation
    $(accordion).addClass('playing')

    if (accordion_items) {
      $(accordion_items).each(function (index, accordion_item) {
        closeAccordionItem(accordion_item)
        var currentTimeoutTime = accordionItemTime * index
        if (screenWidth >= 992) {
          itemsTimeout.push(
            setTimeout(function () {
              showAccordionItem(accordion_items, accordion_item)
            }, currentTimeoutTime)
          )
        }
        $(accordion_item).click(function () {
          // Pause autoplaying timeouts
          for (var i = 0; i < itemsTimeout.length; i++) {
            clearTimeout(itemsTimeout[i])
          }

          showAccordionItem(accordion_items, accordion_item, true)
        })
      })

      if (screenWidth < 992) {
        showAccordionItem(accordion_items, accordion_items[0], true)
      }
    }
  } else if (
    $(window).scrollTop() > accordionBottom &&
    !$(accordion).hasClass('stopped')
  ) {
    // Check if it's in viewport
    $(accordion).addClass('stopped')
    // Pause autoplaying timeouts
    for (var i = 0; i < itemsTimeout.length; i++) {
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

function accordionsInit() {
  const accordions = $('.module---accordion')
  let screenWidth = window.innerWidth
  let itemsTimeout = []

  if (accordions) {
    $(accordions).each(function (index, accordion) {
      // Start accordion animation
      $(window).on('scroll', function () {
        startAccordionAnimation(accordion, screenWidth, itemsTimeout)
      })

      startAccordionAnimation(accordion, screenWidth, itemsTimeout)
    })
  }

  $(window).on('resize', function () {
    screenWidth = window.innerWidth
    $(accordions).each(function (index, accordion) {
      if ($(accordion).hasClass('playing') && screenWidth < 992) {
        // if resizing down to mobile, then pause animation and show current
        for (var i = 0; i < itemsTimeout.length; i++) {
          clearTimeout(itemsTimeout[i])
        }

        $('.accordion-item-loading-bar-fill').stop()
        $('.accordion-item-loading-bar-fill').css('width', '0px')

        var accordion_items = $(accordion).find('.accordion-item')

        showAccordionItem(
          accordion_items,
          accordion_items[currentItemID - 1],
          true
        )
      }
    })
  })
}

window.addEventListener('load', accordionsInit)

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
    'inline-block'
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
          $(pageHeading).html(
            pageHeadingTextStrings[0] +
              '<span class="pageheader-heading__alternatingtext"></span>' +
              pageHeadingTextStrings[1]
          )
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

window.addEventListener('load', alternatingTextInit)

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
      console.log(strokeOffset)
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

window.addEventListener('load', statisticsInit)
