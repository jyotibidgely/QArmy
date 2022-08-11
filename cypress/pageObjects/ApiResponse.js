class ApiResponse {
    baseUrl = Cypress.env('baseURL')

    invoiceDataResponse(uuid, strMeasurementType, bearerToken) {
        return cy.request({
            method: 'GET',
            url: this.baseUrl + '/billingdata/users/' + uuid + '/homes/1/utilitydata?t0=1&t1=1906986799&measurementType='+strMeasurementType,
            headers: { 'Authorization': 'Bearer ' + bearerToken }, timeout: 30000
        })
            .then((Response) => {
                expect(Response.status).to.eq(200)
                let res = Response.body
                return res
            })
    }

    gbJsonResponse(uuid, gatewayId, epochStartTs, epochEndTs, bearerToken) {
        return cy.request({
            method: 'GET',
            url: this.baseUrl + '/streams/users/' + uuid + '/homes/1/gws/'+gatewayId+'/meters/1/gb.json?t0=' + epochStartTs + '&t1=' + epochEndTs,
            headers: { 'Authorization': 'Bearer ' + bearerToken }, timeout: 30000
        })
            .then((Response) => {
                expect(Response.status).to.eq(200)
                let res = Response.body
                return res
            })
    }

    meterApiResponse(uuid, gatewayId, bearerToken) {
        return cy.request({
            method: 'GET',
            url: this.baseUrl + '/meta/users/' + uuid + '/homes/1/gws/'+gatewayId+'/meters',
            headers: { 'Authorization': 'Bearer ' + bearerToken }, timeout: 30000
        })
            .then((Response) => {
                expect(Response.status).to.eq(200)
                let res = Response.body
                return res
            })
    }

}
export default ApiResponse;