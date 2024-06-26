import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.jsx";
import { PersistGate } from "redux-persist/integration/react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import element
import Login from "./page/login/login.jsx";
import App from "./App.jsx";
import Register from "./page/register/register.jsx";
import Home from "./page/home/home.jsx";
import Message from "./page/message/message.jsx";
import Profile from "./page/profile/profile.jsx";
import ProfileApp from "./page/profilePage/profilepage.jsx";
import Friend from "./page/friend/fiend.jsx";
import GroupPage from "./page/group/group.jsx";
import NotFound from "./page/404/notFound.jsx";
import ActivePage from "./page/active/active.jsx";
import ChangePassword from "./page/changePassword/changePassword.jsx";
import ForgotPassword from "./page/forgotPassword/forgotPassword.jsx";
import ResetPassword from "./page/resetPassword/resetPassword.jsx";
import GroupDetail from "./page/groupPage/groupPage.jsx";
import AdminScreen from "./page/admin/admin.jsx";
//Azure
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./setup/auth-config.jsx";

const msalInstance = new PublicClientApplication(msalConfig);

if (
  !msalInstance.getActiveAccount() &&
  msalInstance.getAllAccounts().length > 0
) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((message) => {
  if (
    message.eventType === EventType.LOGIN_SUCCESS &&
    message.payload.account
  ) {
    const account = message.payload.account;
    msalInstance.setActiveAccount(account);
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="message" element={<Message />} />
            <Route path="profilepage/:id" element={<ProfileApp />} />
            <Route path="friend" element={<Friend />} />
            <Route path="group" element={<GroupPage />} />
            <Route path="group/:id" element={<GroupDetail />} />
            <Route path="admin" element={<AdminScreen />} />
          </Route>
          <Route path="/login" element={<Login instance={msalInstance} />} />
          <Route path="register" element={<Register />} />
          <Route path="auth/active/:token" element={<ActivePage />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="auth/reset/:token" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
