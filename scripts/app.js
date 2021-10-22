const $ = (query) => document.querySelector(query)
const selectCurrencyHTML = $('#select__currency')
const selectCriptoHTML = $('#select__crypto')
const formHTML = $('.main__form form')
const resultHTML = $('#form__result')

const currencies = async () => {
    const endpoint = 'https://parseapi.back4app.com/graphql'
    const headers = {
        'X-Parse-Application-Id': 'zyw7jViwaEHow0gqp79s8Df0lzppvmkmTtmB4Owh',
        'X-Parse-Master-Key': 'hyYugHB5h4E0F11Aw3SDLvW7gNL2JGE5gjSOZwUe',
        'X-Parse-Client-Key': 'QMRwRKY9ghZV00XZpYE2xlzKdF7wSJMHWI4yQKpv',
        'content-type': 'application/json',
    }
    const query = `
    query{
        currencies{
            edges{
                node{
                    digits
                    code
                    symbol
                    name
                }
            }
        }
    }
    `
    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({ query }),
    }
    const response = await fetch(endpoint, options)
    const data = await response.json()
    const {
        data: {
            currencies: { edges },
        },
    } = data

    edges.forEach(({ node }) => {
        const optionHTML = document.createElement('option')
        optionHTML.value = node.code
        optionHTML.textContent = `${node.name}`
        selectCurrencyHTML.appendChild(optionHTML)
    })
}

const cripto = async () => {
    const endpoint =
        'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'
    const response = await fetch(endpoint)
    const data = await response.json()
    const { Data } = data

    Data.forEach(({ CoinInfo }) => {
        const optionHTML = document.createElement('option')
        optionHTML.value = CoinInfo.Name
        optionHTML.textContent = `${CoinInfo.FullName}`
        selectCriptoHTML.appendChild(optionHTML)
    })
}

formHTML.addEventListener('submit', async (event) => {
    event.preventDefault()

    const currencyValue = selectCurrencyHTML.value
    const criptoValue = selectCriptoHTML.value
    const endpoint = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptoValue}&tsyms=${currencyValue}`
    const response = await fetch(endpoint)
    const data = await response.json()
    const Data = data.DISPLAY[criptoValue][currencyValue]

    resultHTML.textContent = Data.PRICE
})

currencies()
cripto()
