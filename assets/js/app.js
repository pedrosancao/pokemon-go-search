function init(pokemonList, terms) {
    window.pokemonList = pokemonList
    window.terms = terms
    const fields = window.fields = {
        copy: $('#copy')
    ,   search: $('#search')
    ,   pokemon: $('#pokemon')
    ,   pokemonSpecies: $('#pokemon-species')
    ,   nick: $('#nick')
    }

    fields.search.on('update', function() {
        const conds = []

        conds.push(_.map(fields.pokemon[0].selectedOptions, opt => {
            let [n, name] = opt.textContent.split(' - ')
            return fields.pokemonSpecies.prop('checked') ? '+' + name.toLowerCase() : parseInt(n.substr(1))
        }).join(','))

        conds.push(fields.nick.val())

        $(this).val(_.filter(conds).join('&'))
        fields.copy.attr('disabled', $(this).val().length === 0)
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
    fields.pokemon.select2()
    $(window).on('resize', () => {
        fields.pokemon.select2('destroy').select2()
    })
    $('[data-listen=change]').on('change', () => fields.search.trigger('update'))

    $('#home').removeClass('loading')
}
