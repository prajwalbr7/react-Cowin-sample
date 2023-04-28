// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

const apiStatus = {
  initial: 'INITIAL',
  inprogress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    apiState: apiStatus.initial,
    FoundData: {},
  }

  componentDidMount() {
    this.getDetails()
  }

  getDataFormat = Name => ({
    dose1: Name.dose_1,
    dose2: Name.dose_2,
    vaccineDate: Name.vaccine_date,
  })

  getDetails = async () => {
    this.setState({apiState: apiStatus.inprogress})
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    const DataFetched = await response.json()

    console.log(DataFetched)
    if (response.ok) {
      const UpdatedCoverageData = DataFetched.last_7_days_vaccination.map(
        eachItem => this.getDataFormat(eachItem),
      )
      console.log(UpdatedCoverageData)
      const ConvertData = {
        Last7DaysVaccinate: UpdatedCoverageData,
        VaccinateByAge: DataFetched.vaccination_by_age,
        VaccinateByGender: DataFetched.vaccination_by_gender,
      }

      this.setState({
        FoundData: ConvertData,
        apiState: apiStatus.success,
      })
    } else {
      this.setState({apiState: apiStatus.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="Center">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-view-text">Something went wrong</h1>
    </div>
  )

  renderApiStatus = () => {
    const {apiState} = this.state
    switch (apiState) {
      case apiStatus.success:
        return this.renderPage()

      case apiStatus.failure:
        return this.renderFailureView()

      case apiStatus.inprogress:
        return this.renderLoader()

      default:
        return null
    }
  }

  renderPage = () => {
    const {FoundData} = this.state
    const {VaccinateByGender, VaccinateByAge, Last7DaysVaccinate} = FoundData
    return (
      <>
        <VaccinationCoverage Details={Last7DaysVaccinate} />
        <VaccinationByGender Details={VaccinateByGender} />
        <VaccinationByAge Details={VaccinateByAge} />
      </>
    )
  }

  render() {
    return (
      <div className="container1">
        <div className="container-to-img-para">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="img-plus-style"
          />
          <h1 className="para-cowin-style">Co-WIN</h1>
        </div>
        <h1 className="para-cowin-style2">CoWIN Vaccination in India</h1>
        {this.renderApiStatus()}
      </div>
    )
  }
}
export default CowinDashboard
