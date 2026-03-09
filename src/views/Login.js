import { useSkin } from "@hooks/useSkin"
import { Link, useNavigate } from "react-router-dom"
import { Facebook, Twitter, Mail, GitHub } from "react-feather"
import InputPasswordToggle from "@components/input-password-toggle"
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  Toast
} from "reactstrap"
import "@styles/react/pages/page-authentication.scss"
import { useState } from "react"
import axios from "../API/axios"
import toast from 'react-hot-toast'
import logo from "@src/assets/images/logo/hostynnist-logo.png"
import JwtService from "../@core/auth/jwt/jwtService"
import jwtDefaultConfig from "../@core/auth/jwt/jwtDefaultConfig"
import { useDispatch } from "react-redux"
import { userDataStorage } from "../redux/usermanageReducer"
import { cipherPasswordFunc } from "../common/commonMethods"


const Login = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [display, setDisplay] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  async function loginButton() {
	try {
	  console.log(userName)
	  let cipherPassword = cipherPasswordFunc(password);

	  const loginBody = {
		Username: userName,
		Password: password,
		Event: "selectone",
	  }
	  setDisplay(true)
	  console.log(loginBody);
	  if (userName && password !== '') {
		// const result = await axios.post(`/authentication/userauthentication/loginauthentication`, loginBody)
		   const result = await axios.post(`/authentication/userauthentication/loginauthentication`,loginBody); 
		   console.log("login api result",result)
		  const resultData = result.data[0];
		  console.log("login api result",resultData[0].username)
		dispatch(userDataStorage({
		  "UserName": resultData[0].username,
		  "LoginID": resultData[0].loginID,
		  "Token": resultData[0].token,
		  "UserID": resultData[0].userID,
		  "SecretKey": "123",
		  "UserRoleType": resultData[0].userRoleType,
		  "UserRole": resultData[0].userRole,
		  "Status": resultData[0].status,
		  "PropertyID": resultData[0].propertyID,
		  "HotelName": resultData[0].hotelName,
		  "CompanyID": resultData[0].companyID,
		  "CompanyName": resultData[0].companyName,

		}))
		console.log('result data', resultData)
		if (!resultData[0]) {
		  toast.error('Please Enter Valid User Name And Password', {
			style: {
			  minWidth: '250px'
			},
			duration: 3000
		  })

		  return
		}

		//----commented on 6/2/23---------
		// const loginID = resultData[0].LoginID
		// localStorage.setItem("user-id", loginID)
		// const token = resultData[0].Token
		// localStorage.setItem("user-token", token)
		// const UserRoleID = resultData[0].UserRoleID // TODO need use role name
		// localStorage.setItem("user-role", UserRoleID)



		// console.log(resultData[0].Token)
		//   console.log(jwtDefaultConfig.setToken({"Token":resultData[0].Token,
		//   "LoginID":resultData[0].LoginID,"SecretKey":"123"
		// }))
		// store.dispatch(setUser(resultData))
		// api.jwt.setToken(resultData[0].token)
		localStorage.setItem('userData', JSON.stringify(resultData))
		// navigate(getHomeRouteForLoggedInUser(resultData[0].token))

		if (userName === resultData[0].username && resultData[0].token) {
		  toast.success(`Hello ${resultData[0].username} You Login successfully`, {
			style: {
			  minWidth: '250px'
			},
			duration: 3000
		  })
		  navigate("/dashboard")
		}
	  } else {
		toast.error('Fill All Fields!', {
		  style: {
			minWidth: '250px'
		  },
		  duration: 3000
		})
	  }
	} catch (error) {
	  console.log("Login Page Error", error)
	  toast.error("Username or Password is incorrect")
	}
  }

  const handleKeyPress = () => {
	loginButton()
  }

  function handleEnter(event) {
	if (event.keyCode === 13) {
	  const form = event.target.form
	  const index = Array.prototype.indexOf.call(form, event.target)
	  form.elements[index + 1].focus()
	  event.preventDefault()
	}
  }

  const { skin } = useSkin()

  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg",
	source = require(`@src/assets/images/pages/${illustration}`)

  return (
	<div className="auth-wrapper auth-cover">
	  <Row className="auth-inner m-0">
		<Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
		  {/* <svg viewBox="0 0 139 95" version="1.1" height="28">
			<defs>
			  <linearGradient
				x1="100%"
				y1="10.5120544%"
				x2="50%"
				y2="89.4879456%"
				id="linearGradient-1"
			  >
				<stop stopColor="#000000" offset="0%"></stop>
				<stop stopColor="#FFFFFF" offset="100%"></stop>
			  </linearGradient>
			  <linearGradient
				x1="64.0437835%"
				y1="46.3276743%"
				x2="37.373316%"
				y2="100%"
				id="linearGradient-2"
			  >
				<stop stopColor="#EEEEEE" stopOpacity="0" offset="0%"></stop>
				<stop stopColor="#FFFFFF" offset="100%"></stop>
			  </linearGradient>
			</defs>
			<g
			  id="Page-1"
			  stroke="none"
			  strokeWidth="1"
			  fill="none"
			  fillRule="evenodd"
			>
			  <g id="Artboard" transform="translate(-400.000000, -178.000000)">
				<g id="Group" transform="translate(400.000000, 178.000000)">
				  <path
					d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
					id="Path"
					className="text-primary"
					style={{ fill: "currentColor" }}
				  ></path>
				  <path
					d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
					id="Path"
					fill="url(#linearGradient-1)"
					opacity="0.2"
				  ></path>
				  <polygon
					id="Path-2"
					fill="#000000"
					opacity="0.049999997"
					points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
				  ></polygon>
				  <polygon
					id="Path-2"
					fill="#000000"
					opacity="0.099999994"
					points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
				  ></polygon>
				  <polygon
					id="Path-3"
					fill="url(#linearGradient-2)"
					opacity="0.099999994"
					points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
				  ></polygon>
				</g>
			  </g>
			</g>
		  </svg> */}
		  <h2 className="brand-text" style={{ color: '#7B68EE' }}>Hostynnist</h2>
		</Link>
		<Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
		  <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
			<img className="img-fluid" src={source} alt="Login Cover" />
		  </div>
		</Col>
		<Col
		  className="d-flex align-items-center auth-bg px-2 p-lg-5"
		  lg="4"
		  sm="12"
		>

		  <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
			<CardTitle tag="h2" className="fw-bold mb-1">
			  <img className="fallback-logo" height={28} width={30} src={logo} alt="logo" /> Welcome to Hostynnist! 👋
			</CardTitle>
			{/* <CardText className="mb-2">
			  Please sign-in to your account & start the adventure
			</CardText> */}
			<Form
			  className="auth-login-form mt-2"
			  onSubmit={(e) => e.preventDefault()}
			>
			  <div className="mb-1">
				<Label className="form-label" for="login-email">
				  Username
				</Label>
				<Input
				  type="text"
				  id="login-email"
				  className="form-control"
				  onChange={(e) => setUserName(e.target.value)}
				  autoFocus
				  invalid={display && userName === ''}
				  onKeyDown={handleEnter}
				/>
				{display && !userName ? <span className='error_msg_lbl'>Username is required </span> : null}
			  </div>
			  <div className="mb-1">
				<Label className="form-label" for="login-password">
				  Password
				</Label>
				{/* <InputPasswordToggle
				  className="input-group-merge"
				  id="login-password"
				/> */}
				<Input
				  type="password"
				  className="form-control"
				  onChange={(e) => setPassword(e.target.value)}
				  invalid={display && password === ''}
				  onKeyPress={(e) => e.key === 'Enter' && handleKeyPress()} />
				{display && !password ? <span className='error_msg_lbl'>Password is required </span> : null}
			  </div>
			  {/* <div className="form-check mb-1">
				<Input type="checkbox" id="remember-me" />
				<Label className="form-check-label" for="remember-me">
				  Remember Me
				</Label>
			  </div> */}
			  <div className="float-end">
				<Link to="/forgot-password">
				  <small>Forgot Password?</small>
				</Link>
			  </div>
			  <Button onClick={loginButton} color="primary" block>
				Sign in
			  </Button>
			</Form>
			{/* <p className="text-center mt-2">
			  <span className="me-25">New on our platform?</span>
			  <Link to="/register">
				<span>Create an account</span>
			  </Link>
			</p>
			<div className="divider my-2">
			  <div className="divider-text">or</div>
			</div>
			<div className="auth-footer-btn d-flex justify-content-center">
			  <Button color="facebook">
				<Facebook size={14} />
			  </Button>
			  <Button color="twitter">
				<Twitter size={14} />
			  </Button>
			  <Button color="google">
				<Mail size={14} />
			  </Button>
			  <Button className="me-0" color="github">
				<GitHub size={14} />
			  </Button>
			</div> */}
		  </Col>
		</Col>
	  </Row>
	</div>
  )
}

export default Login
