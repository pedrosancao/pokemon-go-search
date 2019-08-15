function init(pokemonList, terms) {
    window.pokemonList = pokemonList
    window.terms = terms
    const fields = window.fields = {
        copy: $('#copy')
    ,   search: $('#search')
    ,   pokemon: $('#pokemon')
    ,   pokemonSpecies: $('#pokemon-group-species')
    ,   pokemonRange: $('#pokemon-group-range')
    ,   nick: $('#nick')
    }

    $('[type=radio]').on('click', function(e) {
        $('[name=' + this.name + ']').not(this).data('check', false)
        if ($(this).data('check')) this.checked = false
        $(this).data('check', this.checked)
    })

    fields.search.on('update', function() {
        const conds = []

        if (fields.pokemonRange[0].checked) {
            conds.push(_.map(_.chunk(fields.pokemon[0].selectedOptions, 2), chunk => {
                chunk = chunk.map(opt => parseInt(opt.textContent.substr(1, opt.textContent.indexOf(' - ') - 1)))
                chunk[1] = chunk[1] || ''
                return chunk.join('-')
            }).join(','))
        } else {
            conds.push(_.map(fields.pokemon[0].selectedOptions, opt => {
                let [n, name] = opt.textContent.split(' - ')
                return fields.pokemonSpecies.prop('checked') ? '+' + name.toLowerCase() : parseInt(n.substr(1))
            }).join(','))
        }

        conds.push(fields.nick.val())

        $(this).val(_.filter(conds).join('&'))
        fields.copy.prop('disabled', $(this).val().length === 0)
    }).trigger('update')

    fields.copy.on('click', function() {
        const val = fields.search.val()
        fields.search[0].select()
        document.execCommand('copy')
        fields.search[0].setSelectionRange(0,0)
        fields.search.val('Search copied to clipboard')
        fields.search.addClass('is-valid text-success')
        setTimeout(() => {
            fields.search.val(val)
            fields.search.removeClass('is-valid text-success')
            fields.search.blur()
        }, 1000)
        $(this).blur()
    })

    _.each(_.pickBy(pokemonList, 'available'), (opt, n) => fields.pokemon.append(new Option(`${n} - ${opt.name}`, n)))

    let previousWidth = $(window).width()
    $.fn.select2.defaults.set('closeOnSelect', false    );
    fields.pokemon.select2()
    $(window).on('resize', () => {
        const currentWidth = $(window).width()
        if (previousWidth !== currentWidth) {
            fields.pokemon.select2('destroy').select2()
        }
        previousWidth = currentWidth
    })

    $('[data-listen]').each(function() {
        $(this).on($(this).data('listen'), () => fields.search.trigger('update'))
    })

    $('#home').removeClass('loading')
}
