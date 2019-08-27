function init(pokemonList, terms) {
    window.pokemonList = pokemonList
    window.terms = terms
    const fields = window.fields = {
        copy: $('#copy')
    ,   search: $('#search')
    ,   pokemon: $('#pokemon')
    ,   pokemonHandle: $('[name=pokemon-handle]')
    ,   nick: $('#nick')
    }
    const exportPokemon = function() {
        const handle = fields.pokemonHandle.filter(':checked').val()
        const included = $('[data-for=' + this.id + ']').prop('checked')
        return handle === 'range'
            ? _.map(_.chunk(this.selectedOptions, 2), chunk => {
                chunk = chunk.map(opt => parseInt(opt.textContent.substr(1, opt.textContent.indexOf(' - ') - 1)))
                chunk[1] = chunk[1] || ''
                return (included ? '' : '!') + chunk.join('-')
            }).join(included ? ',' : '&')
            : _.map(this.selectedOptions, opt => {
                let [n, name] = opt.textContent.split(' - ')
                return (included ? '' : '!') + (handle === 'species' ? '+' + name.toLowerCase() : parseInt(n.substr(1)))
            }).join(included ? ',' : '&')
    }
    const exportNick = function() {
        const included = $('[data-for=' + this.id + ']').prop('checked')
        return (included ? '' : '!') + this.value
    }

    $('[type=radio]').on('click', function(e) {
        $('[name=' + this.name + ']').not(this).each(function() {
            $(this).parent().removeClass('active')
        })
        $(this).parent().addClass('active')
    }).each(function() {
        $(this).parent()[this.checked ? 'addClass' : 'removeClass']('active')
    })

    $('[type=checkbox].include-status').on('change', function(e) {
        $(this).parent().removeClass('btn-success btn-danger')
            .addClass(this.checked ? 'btn-success' : 'btn-danger')
        $(this.nextElementSibling).text(this.checked ? 'Include:' : 'Exclude:')
    }).each(function() {
        $(this).trigger('change')
    })

    fields.search.on('update', function() {
        const conds = []

        conds.push(exportPokemon.call(fields.pokemon[0]))
        conds.push(exportNick.call(fields.nick[0]))

        $(this).val(_.filter(conds).join('&'))
        fields.copy.prop('disabled', $(this).val().length === 0)
    }).trigger('update')

    fields.copy.on('click', function() {
        const val = fields.search.val()
        this.disabled = true;
        fields.search[0].select()
        document.execCommand('copy')
        fields.search.blur()
        fields.search[0].setSelectionRange(0,0)
        fields.search.val('Search copied to clipboard')
        fields.search.addClass('is-valid text-success')
        setTimeout(() => {
            fields.search.val(val)
            fields.search.removeClass('is-valid text-success')
            this.disabled = false;
        }, 1000)
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
