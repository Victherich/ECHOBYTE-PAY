
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "@/firebaseConfig";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const getFirebaseError = (err) => {
    switch (err.code) {
      case "auth/email-already-in-use":
        return "This email address already has an account. Please log in.";

      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/weak-password":
        return "Your password must contain at least 6 characters.";

      case "auth/popup-closed-by-user":
        return "Google sign-up was cancelled.";

      case "auth/popup-blocked":
        return "Your browser blocked the Google sign-in popup. Please allow popups and try again.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";

      default:
        return err.message || "Something went wrong. Please try again.";
    }
  };

  // EMAIL AND PASSWORD SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const confirmEmail = form.confirmEmail.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (email !== confirmEmail) {
      setError("Your email addresses do not match.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Your password must contain at least 6 characters.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        form.password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        phone,
        role: "user",
        createdAt: serverTimestamp(),
      });

      router.replace("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError(getFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE SIGNUP
  const handleGoogleSignUp = async () => {
    if (!agreed) {
      setError("Please agree to the Terms & Conditions and Privacy Policy before continuing.");
      return;
    }

    try {
      setError("");
      setGoogleLoading(true);

      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || "LIFEOS User",
          email: user.email || "",
          phone: user.phoneNumber || "",
          role: "user",
          createdAt: serverTimestamp(),
        });
      }

      router.replace("/dashboard");
    } catch (err) {
      console.error("Google signup error:", err);
      setError(getFirebaseError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Page>
      <BackgroundGlow />

      <TopBar>
        <Brand href="/">
          <BrandLogo>✳</BrandLogo>
          <span>LIFEOS</span>
        </Brand>

        <TopLogin>
          Already a member?
          <Link href="/login">Log in</Link>
        </TopLogin>
      </TopBar>

      <Main>
        <LeftPanel>
          <LeftContent>
            <WelcomeBadge>
              <span>✳</span>
              YOUR LIFE. ONE ORGANIZED SYSTEM.
            </WelcomeBadge>

            <h1>
              Make room for
              <GradientText> what matters.</GradientText>
            </h1>

            <Description>
              Bring your work, business, family, finances, goals and
              everyday responsibilities together in one personal
              life-management workspace.
            </Description>

            <Benefits>
              <Benefit>
                <BenefitIcon>✓</BenefitIcon>
                Organize every area of your life
              </Benefit>

              <Benefit>
                <BenefitIcon>✓</BenefitIcon>
                Stay focused on your priorities
              </Benefit>

              <Benefit>
                <BenefitIcon>✓</BenefitIcon>
                Track your goals and progress
              </Benefit>

              <Benefit>
                <BenefitIcon>✓</BenefitIcon>
                Access your workspace anywhere
              </Benefit>
            </Benefits>

            <QuoteCard>
              <QuoteIcon>“</QuoteIcon>
              <p>
                A better organized life starts with one small step.
              </p>
              <span>Welcome to LIFEOS.</span>
            </QuoteCard>
          </LeftContent>
        </LeftPanel>

        <RightPanel>
          <SignupCard>
            <MobileBrand>
              <BrandLogo>✳</BrandLogo>
              LIFEOS
            </MobileBrand>

            <CardHeader>
              <StepLabel>
                <span>01</span> / CREATE YOUR ACCOUNT
              </StepLabel>

              <h2>Create your account</h2>

              <p>
                Start building your personal LIFEOS workspace.
              </p>
            </CardHeader>

            <GoogleButton
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <Spinner />
              ) : (
                <GoogleIcon>
                  <svg viewBox="0 0 48 48" width="20" height="20">
                    <path
                      fill="#4285F4"
                      d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.7-4 6.1v5.1h6.5c3.8-3.5 6.1-8.7 6.1-14.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 44c5.4 0 9.9-1.8 13.2-4.8l-6.5-5.1c-1.8 1.2-4.1 2-6.7 2-5.2 0-9.6-3.5-11.2-8.2H6.1v5.2C9.4 39.6 16.2 44 24 44z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M12.8 27.9c-.4-1.2-.7-2.5-.7-3.9s.3-2.7.7-3.9v-5.2H6.1C4.7 17.7 4 20.8 4 24s.7 6.3 2.1 9.1l6.7-5.2z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 11.9c2.9 0 5.5 1 7.5 2.9l5.8-5.8C33.8 5.8 29.4 4 24 4 16.2 4 9.4 8.4 6.1 14.9l6.7 5.2c1.6-4.7 6-8.2 11.2-8.2z"
                    />
                  </svg>
                </GoogleIcon>
              )}

              {googleLoading ? "Connecting to Google..." : "Continue with Google"}
            </GoogleButton>

            <Divider>
              <span>OR SIGN UP WITH EMAIL</span>
            </Divider>

            {error && (
              <ErrorMessage role="alert">
                <span>!</span>
                {error}
              </ErrorMessage>
            )}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Full name</Label>
                <InputWrapper>
                  <InputIcon>♙</InputIcon>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email address</Label>
                <InputWrapper>
                  <InputIcon>✉</InputIcon>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmEmail">Confirm email address</Label>
                <InputWrapper>
                  <InputIcon>✉</InputIcon>
                  <Input
                    id="confirmEmail"
                    name="confirmEmail"
                    type="email"
                    placeholder="Enter your email again"
                    value={form.confirmEmail}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="phone">Phone number</Label>
                <InputWrapper>
                  <InputIcon>⌕</InputIcon>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <InputWrapper>
                    <InputIcon>⌑</InputIcon>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                    />
                    <EyeButton
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </EyeButton>
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <InputWrapper>
                    <InputIcon>⌑</InputIcon>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                    />
                    <EyeButton
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </EyeButton>
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <Agreement>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  id="agreement"
                />

                <label htmlFor="agreement">
                  I agree to the{" "}
                  <Link href="/terms-conditions" target="_blank">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" target="_blank">
                    Privacy Policy
                  </Link>
                </label>
              </Agreement>

              <SubmitButton
                type="submit"
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <>
                    <Spinner />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Create my LIFEOS account
                    <span>→</span>
                  </>
                )}
              </SubmitButton>
            </Form>

            <BottomLogin>
              Already have an account?{" "}
              <Link href="/login">Log in</Link>
            </BottomLogin>

            <SecureNote>
              <span>♢</span>
              Your personal workspace is private and secure.
            </SecureNote>
          </SignupCard>
        </RightPanel>
      </Main>

      <Footer>
        <span>© {new Date().getFullYear()} LIFEOS</span>
        <span>Your Personal Life Operating System.</span>
      </Footer>
    </Page>
  );
}

/* ================= STYLES ================= */

const Page = styled.main`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #080d1b;
  color: #f8faff;
  font-family: Arial, Helvetica, sans-serif;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  width: 550px;
  height: 550px;
  top: 100px;
  left: -200px;
  border-radius: 50%;
  background: rgba(102, 81, 255, 0.12);
  filter: blur(130px);
  pointer-events: none;
`;

const TopBar = styled.header`
  max-width: 1300px;
  height: 78px;
  padding: 0 30px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
  border-bottom: 1px solid rgba(255,255,255,.07);

  @media(max-width: 600px) {
    height: 68px;
    padding: 0 20px;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  text-decoration: none;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -1px;
`;

const BrandLogo = styled.span`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: linear-gradient(135deg, #765df5, #39b5f2);
  color: white;
  font-size: 24px;
`;

const TopLogin = styled.div`
  color: #929db2;
  font-size: 12px;

  a {
    margin-left: 8px;
    color: #a99aff;
    font-weight: 800;
    text-decoration: none;
  }
`;

const Main = styled.div`
  max-width: 1300px;
  min-height: calc(100vh - 130px);
  padding: 45px 30px;
  margin: auto;
  display: grid;
  grid-template-columns: .8fr 1.2fr;
  align-items: center;
  gap: 75px;
  position: relative;
  z-index: 1;

  @media(max-width: 950px) {
    grid-template-columns: 1fr;
    gap: 35px;
    max-width: 600px;
    padding: 35px 20px 55px;
  }
`;

const LeftPanel = styled.div`
  @media(max-width: 950px) {
    display: none;
  }
`;

const LeftContent = styled.div`
  max-width: 460px;

  h1 {
    margin: 27px 0 18px;
    font-size: clamp(42px, 4.6vw, 60px);
    letter-spacing: -3px;
    line-height: 1.08;
  }
`;

const WelcomeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 10px 13px;
  border: 1px solid rgba(139,125,255,.25);
  border-radius: 30px;
  color: #b6aaff;
  background: rgba(105,83,255,.09);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;

  span { font-size: 16px; }
`;

const GradientText = styled.span`
  background: linear-gradient(100deg, #a99aff, #69caff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Description = styled.p`
  color: #9ca9bf;
  font-size: 14px;
  line-height: 1.9;
`;

const Benefits = styled.div`
  display: grid;
  gap: 17px;
  margin-top: 32px;
`;

const Benefit = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #dce3f0;
  font-size: 13px;
`;

const BenefitIcon = styled.span`
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: #183d35;
  color: #6ce3b7;
  font-size: 12px;
`;

const QuoteCard = styled.div`
  margin-top: 45px;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #26324a;
  background: rgba(255,255,255,.025);

  > div { color: #a99aff; }

  p {
    margin: 5px 0 10px;
    color: #e0e5f0;
    font-size: 13px;
  }

  span {
    color: #8591a8;
    font-size: 10px;
  }
`;

const QuoteIcon = styled.div`
  color: #a99aff;
  font-size: 35px;
  line-height: 1;
`;

const RightPanel = styled.div`
  display: flex;
  justify-content: center;
`;

const SignupCard = styled.div`
  width: 100%;
  max-width: 570px;
  padding: 37px;
  border: 1px solid #28344b;
  border-radius: 25px;
  background: linear-gradient(145deg, #131e33, #0e1628);
  box-shadow: 0 25px 80px rgba(0,0,0,.3);

  @media(max-width: 600px) {
    padding: 25px 19px;
    border-radius: 20px;
  }
`;

const MobileBrand = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-bottom: 28px;
  font-size: 21px;
  font-weight: 900;

  ${BrandLogo} { width: 32px; height: 32px; }

  @media(max-width: 950px) {
    display: flex;
  }
`;

const CardHeader = styled.div`
  margin-bottom: 23px;

  h2 {
    margin: 14px 0 7px;
    font-size: 28px;
    letter-spacing: -1px;
  }

  p {
    margin: 0;
    color: #98a5bb;
    font-size: 12px;
    line-height: 1.7;
  }

  @media(max-width: 600px) {
    h2 { font-size: 25px; }
  }
`;

const StepLabel = styled.div`
  color: #a99aff;
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 1.2px;

  span {
    display: inline-grid;
    place-items: center;
    width: 22px;
    height: 22px;
    margin-right: 7px;
    border-radius: 7px;
    background: rgba(120,98,255,.2);
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  height: 49px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px solid #3a465c;
  border-radius: 11px;
  background: #f9fbff;
  color: #202b40;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: .2s;

  &:hover { background: #eaf0fb; }
  &:disabled { opacity: .65; cursor: not-allowed; }
`;

const GoogleIcon = styled.span`
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 23px 0;
  color: #78869d;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;

  &::before, &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #2c3850;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  margin-bottom: 17px;
  border: 1px solid rgba(255,105,105,.25);
  border-radius: 10px;
  background: rgba(255,70,70,.08);
  color: #ffaaaa;
  font-size: 11px;
  line-height: 1.6;

  span {
    flex-shrink: 0;
    width: 17px;
    height: 17px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgba(255,100,100,.18);
    font-weight: 900;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #d5dcec;
  font-size: 11px;
  font-weight: 750;
`;

const InputWrapper = styled.div`
  min-width: 0;
  height: 47px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  border: 1px solid #35425a;
  border-radius: 10px;
  background: #0c1425;
  transition: border .2s;

  &:focus-within {
    border-color: #8878ff;
    box-shadow: 0 0 0 3px rgba(117,94,255,.1);
  }
`;

const InputIcon = styled.span`
  flex-shrink: 0;
  color: #8996b0;
  font-size: 16px;
`;

const Input = styled.input`
  min-width: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background-color: #0c1424 !important;
  color: #ffffff !important;
  font-size: 12px;
  appearance: none;
  -webkit-appearance: none;

  &::placeholder {
    color: #68758d;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-text-fill-color: #ffffff !important;
    -webkit-box-shadow: 0 0 0 1000px #0c1424 inset !important;
    box-shadow: 0 0 0 1000px #0c1424 inset !important;
    background-color: #0c1424 !important;
    caret-color: #ffffff;
  }
`;

const EyeButton = styled.button`
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: #a99aff;
  font-size: 9px;
  font-weight: 800;
  cursor: pointer;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media(max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Agreement = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 4px 0;

  input {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-top: 1px;
    accent-color: #7965f4;
    cursor: pointer;
  }

  label {
    color: #a3afc4;
    font-size: 10px;
    line-height: 1.7;
  }

  a {
    color: #b5a7ff;
    text-decoration: none;
    font-weight: 800;
  }

  a:hover { text-decoration: underline; }
`;

const SubmitButton = styled.button`
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 5px;
  border: none;
  border-radius: 11px;
  background: linear-gradient(110deg, #7059f5, #477eea);
  color: white;
  font-size: 12px;
  font-weight: 850;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(94,83,239,.2);
  transition: .2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 13px 30px rgba(94,83,239,.35);
  }

  &:disabled { opacity: .65; cursor: not-allowed; }

  span { font-size: 17px; }
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  display: inline-block;
  flex-shrink: 0;
  border: 2px solid rgba(255,255,255,.35);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin .7s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const BottomLogin = styled.div`
  margin-top: 23px;
  text-align: center;
  color: #96a2b7;
  font-size: 11px;

  a {
    color: #b6aaff;
    font-weight: 850;
    text-decoration: none;
  }
`;

const SecureNote = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 23px;
  padding-top: 18px;
  border-top: 1px solid #29354a;
  color: #7e8ba2;
  font-size: 9px;

  span { color: #70dcb5; font-size: 15px; }
`;

const Footer = styled.footer`
  max-width: 1300px;
  margin: auto;
  padding: 15px 30px 25px;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  color: #69768d;
  font-size: 10px;

  @media(max-width: 600px) {
    padding: 0 20px 25px;
    flex-direction: column;
    align-items: center;
  }
`;
