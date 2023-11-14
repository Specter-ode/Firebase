const googleMapsService = {
  getCountries: async (inputValue) => {
    // console.log(inputValue);
    const autocomplete = new window.google.maps.places.AutocompleteService()
    const { predictions } = await autocomplete.getPlacePredictions({
      input: inputValue,
      types: ["country"],
    })
    // console.log(autocomplete);
    return predictions?.map((item) => item.description)
  },

  getCities: async (inputValue) => {
    const autocomplete = new window.google.maps.places.AutocompleteService()
    const { predictions } = await autocomplete.getPlacePredictions({
      input: inputValue,
      types: ["(cities)"],
    })
    return predictions?.map((item) => ({
      value: item.structured_formatting.secondary_text,
      label: item.description,
    }))
  },
}

export default googleMapsService
