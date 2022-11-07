import $ from 'jquery'

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

  console.log('test')

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

      console.log(current_arrow)

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
    Filters - custom close buttons
    ========================================================================== */

$('.filter-dropdown-close').click(function () {
  $('.filter-filter-dropdown').trigger('w-close')
})

$('.filter-dropdown-view-button').click(function (e) {
  e.preventDefault()
  $('.filter-filter-dropdown').trigger('w-close')
})
