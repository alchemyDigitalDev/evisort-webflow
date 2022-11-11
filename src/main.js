import './styles/style.css'

/*  ==========================================================================
		JS For browser resize to get a vh value that works on mobile - used for mobile nav height
		========================================================================== */

// JS to get vh value that works on all browsers & devices
function resize() {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `jQuery{vh}px`)
}

window.addEventListener('resize', resize)
window.addEventListener('load', resize)

/*  ==========================================================================
    Check if element is in view
    ========================================================================== */

function isScrolledIntoView(elem) {
  var docViewTop = jQuery(window).scrollTop()
  var docViewBottom = docViewTop + jQuery(window).height()

  var elemTop = jQuery(elem).offset().top
  var elemBottom = elemTop + 100

  return elemBottom <= docViewBottom && elemTop >= docViewTop
}

/*  ==========================================================================
    Acccordion Module Animation 
    ========================================================================== */

const accordionItemTime = 5000
let currentItemID = 1

function closeAccordionItem(closeItem) {
  var accordion_loadingbar = jQuery(closeItem).find(
    '.accordion-item-loading-bar'
  )
  var accordion_loadingbarfill = jQuery(closeItem).find(
    '.accordion-item-loading-bar-fill'
  )
  var accordion_content = jQuery(closeItem).find('.accordion-item-content')
  var accordion_mobilequote = jQuery(closeItem).find(
    '.accordion-tile-quote-wrap---mobile'
  )
  var accordion_arrow = jQuery(closeItem).find('.icon-accordion-chevron')

  // Stop animations
  accordion_loadingbar.stop()
  accordion_loadingbarfill.stop()
  accordion_content.stop()
  accordion_mobilequote.stop()
  accordion_arrow.stop()

  // Set all loading bar fills to 0
  jQuery(closeItem).css('backgroundColor', 'transparent')
  jQuery(accordion_loadingbarfill).css('width', '0px')
  jQuery(accordion_content).css('max-height', '0px')
  jQuery(accordion_loadingbar).css('height', '1px')
  jQuery(accordion_loadingbar).css('backgroundColor', 'rgba(0,0,0,0.2)')
  jQuery(accordion_loadingbarfill).css('display', 'none')
  jQuery(accordion_mobilequote).css('max-height', '0px')
  jQuery(accordion_arrow).css('transform', 'none')
}

function showAccordionItem(accordion_items, openItem, userClicked = false) {
  // Hide other accordion items
  jQuery(accordion_items)
    .not(openItem)
    .each(function (index, accordion_item) {
      closeAccordionItem(accordion_item)
    })
    .promise()
    .done(function () {
      // Show current one
      var current_loadingbar = jQuery(openItem).find(
        '.accordion-item-loading-bar'
      )
      var current_loadingbarfill = jQuery(openItem).find(
        '.accordion-item-loading-bar-fill'
      )
      var current_content = jQuery(openItem).find('.accordion-item-content')
      var current_id = jQuery(openItem).data('accordion-id')
      var current_quote = jQuery(openItem)
        .closest('.module---accordion')
        .find(
          '.accordion-tile-quote-wrap---desktop.accordion-tile-quote-wrap-' +
            current_id
        )
      var current_quote_mobile = jQuery(openItem).find(
        '.accordion-tile-quote-wrap---mobile'
      )
      var current_arrow = jQuery(openItem).find('.icon-accordion-chevron')

      currentItemID = current_id

      jQuery(openItem).css('backgroundColor', '#fff9f0')
      jQuery(current_loadingbarfill).css('display', 'block')
      jQuery(current_loadingbar).css('backgroundColor', '#83a8f8')
      jQuery(current_loadingbar).animate({ height: '10px' }, 100)
      jQuery(current_content).animate({ 'max-height': '750px' }, 750)
      jQuery(current_quote_mobile).animate({ 'max-height': '750px' }, 750)
      jQuery(current_arrow).css('transform', 'rotate(-180deg)')

      // Hide other quotes
      jQuery(openItem)
        .closest('.module---accordion')
        .find('.accordion-tile-quote-wrap---desktop')
        .css('display', 'none')
      // Show this quote
      jQuery(current_quote).css('display', 'block')

      if (userClicked) {
        jQuery(current_loadingbarfill).animate({ width: '100%' }, 0)
      } else {
        jQuery(current_loadingbarfill).animate(
          { width: '100%' },
          accordionItemTime
        )
      }
    })
}

function startAccordionAnimation(accordion, screenWidth, itemsTimeout) {
  var accordionTop = jQuery(accordion).offset().top - jQuery(window).height()
  var accordionBottom =
    jQuery(accordion).offset().top + jQuery(accordion).outerHeight()
  var accordion_items = jQuery(accordion).find('.accordion-item')

  if (
    jQuery(window).scrollTop() > accordionTop &&
    !jQuery(accordion).hasClass('playing')
  ) {
    // Check if it's in viewport
    // Start animation
    jQuery(accordion).addClass('playing')

    if (accordion_items) {
      jQuery(accordion_items).each(function (index, accordion_item) {
        closeAccordionItem(accordion_item)
        var currentTimeoutTime = accordionItemTime * index
        if (screenWidth >= 992) {
          itemsTimeout.push(
            setTimeout(function () {
              showAccordionItem(accordion_items, accordion_item)
            }, currentTimeoutTime)
          )
        }
        jQuery(accordion_item).click(function () {
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
    jQuery(window).scrollTop() > accordionBottom &&
    !jQuery(accordion).hasClass('stopped')
  ) {
    // Check if it's in viewport
    jQuery(accordion).addClass('stopped')
    // Pause autoplaying timeouts
    for (var i = 0; i < itemsTimeout.length; i++) {
      clearTimeout(itemsTimeout[i])
    }
    jQuery(accordion_items[currentItemID - 1])
      .find('.accordion-item-loading-bar-fill')
      .stop()
    jQuery(accordion_items[currentItemID - 1])
      .find('.accordion-item-loading-bar-fill')
      .css('width', '100%')
  }
}

function accordionsInit() {
  const accordions = jQuery('.module---accordion')
  let screenWidth = window.innerWidth
  let itemsTimeout = []

  if (accordions) {
    jQuery(accordions).each(function (index, accordion) {
      // Start accordion animation
      jQuery(window).on('scroll', function () {
        startAccordionAnimation(accordion, screenWidth, itemsTimeout)
      })

      startAccordionAnimation(accordion, screenWidth, itemsTimeout)
    })
  }

  jQuery(window).on('resize', function () {
    screenWidth = window.innerWidth
    jQuery(accordions).each(function (index, accordion) {
      if (jQuery(accordion).hasClass('playing') && screenWidth < 992) {
        // if resizing down to mobile, then pause animation and show current
        for (var i = 0; i < itemsTimeout.length; i++) {
          clearTimeout(itemsTimeout[i])
        }

        jQuery('.accordion-item-loading-bar-fill').stop()
        jQuery('.accordion-item-loading-bar-fill').css('width', '0px')

        var accordion_items = jQuery(accordion).find('.accordion-item')

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
  jQuery('.pageheader-heading__alternatingtext__item--' + count).animate(
    {
      opacity: '0',
    },
    { duration: 900, queue: false }
  )

  jQuery('.pageheader-heading__alternatingtext__item--' + count).css(
    'display',
    'none'
  )

  count++
  if (count > maxCount) {
    count = 1
  }

  jQuery('.pageheader-heading__alternatingtext__item--' + count).css(
    'display',
    'inline-block'
  )

  jQuery('.pageheader-heading__alternatingtext__item--' + count).animate(
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
  let pageHeadings = jQuery('.pageheader-heading')
  if (pageHeadings) {
    jQuery(pageHeadings).each(function (index, pageHeading) {
      let pageHeadingText = jQuery(pageHeading).text()
      let pageHeadingTextToReplace = jQuery(pageHeading).data('replacetext')
      let pageHeadingTextStrings = pageHeadingText.split(
        pageHeadingTextToReplace
      )
      let alternatingTextWords = jQuery(pageHeading).data('alternatingtext')
      if (alternatingTextWords) {
        let alternatingTextArray = alternatingTextWords.split('*')
        alternatingTextArray = alternatingTextArray.filter(function (el) {
          return el != ''
        })
        if (alternatingTextArray) {
          jQuery(pageHeading).html(
            pageHeadingTextStrings[0] +
              '<span class="pageheader-heading__alternatingtext"></span>' +
              pageHeadingTextStrings[1]
          )
          jQuery(alternatingTextArray).each(function (
            index,
            alternatingTextArrayItem
          ) {
            let itemCountNo = index + 1
            jQuery(pageHeading)
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
          jQuery(pageHeading).addClass('loaded')
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
  let statisticModules = jQuery('.module---statistics')

  jQuery(statisticModules).each(function () {
    // Setup items ready for animation
    jQuery(this)
      .find('.counter')
      .each(function () {
        jQuery(this).data('counter', jQuery(this).text())
        jQuery(this).text(0)
      })
  })

  animateStatistics(statisticModules)

  jQuery(window).scroll(function () {
    // Trigger animations on scroll
    animateStatistics(statisticModules)
  })
}

function animateStatistics(statisticModules) {
  jQuery(statisticModules).each(function () {
    if (isScrolledIntoView(jQuery(this)) && !jQuery(this).hasClass('loaded')) {
      jQuery(this).addClass('loaded')
      jQuery(this)
        .find('.counter')
        .each(function () {
          jQuery(this)
            .prop('Counter', 0)
            .animate(
              {
                Counter: jQuery(this).data('counter'),
              },
              {
                duration: 2000,
                easing: 'swing',
                step: function (now) {
                  jQuery(this).text(Math.ceil(now))
                },
              }
            )
        })
      // First stat SVG animation
      let statPercentage = jQuery(this)
        .find('.statistic-animation-wrap---1')
        .find('.counter')
        .data('counter')
      let strokeOffset = 100 - parseInt(statPercentage)
      if (strokeOffset < 10) {
        strokeOffset = 10
      }
      console.log(strokeOffset)
      jQuery(this)
        .find('.statistic-animation-wrap---1')
        .find('.circle-fill')
        .animate({ 'stroke-dashoffset': strokeOffset }, 2000)

      // Second stat SVG animation
      jQuery(this)
        .find('.statistic-animation-wrap---2')
        .find('.dot-1')
        .animate(
          {
            opacity: 1,
          },
          {
            step: function (now) {
              jQuery(this).css('transform', 'scale(' + now + ')')
            },
            duration: 1000,
          }
        )
      jQuery(this)
        .find('.statistic-animation-wrap---2')
        .find('.dot-2')
        .delay(400)
        .animate(
          {
            opacity: 1,
          },
          {
            step: function (now) {
              jQuery(this).css('transform', 'scale(' + now + ')')
            },
            duration: 1000,
          }
        )
      jQuery(this)
        .find('.statistic-animation-wrap---2')
        .find('.dot-3')
        .delay(800)
        .animate(
          {
            opacity: 1,
          },
          {
            step: function (now) {
              jQuery(this).css('transform', 'scale(' + now + ')')
            },
            duration: 1000,
          }
        )
      // Thirds stat SVG animation
      jQuery(this)
        .find('.statistic-animation-wrap---3')
        .find('.fill-1')
        .animate({ 'stroke-dashoffset': '0' }, 1000)
      jQuery(this)
        .find('.statistic-animation-wrap---3')
        .find('.fill-2')
        .animate({ 'stroke-dashoffset': '30' }, 1000)
      jQuery(this)
        .find('.statistic-animation-wrap---3')
        .find('.fill-3')
        .animate({ 'stroke-dashoffset': '65' }, 1000)
    }
  })
}

window.addEventListener('load', statisticsInit)
