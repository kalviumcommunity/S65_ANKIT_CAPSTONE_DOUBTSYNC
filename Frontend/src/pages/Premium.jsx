import styles from '../components/css/PremiumPage.module.css';
import StudentNavBar from '../components/StudentNavBar';
import { useNavigate } from "react-router-dom";

const PremiumPage = () => {
  const navigate = useNavigate();

  const plans = [
    {
      title: 'Starter',
      minutes: 30,
      price: '₹99',
      features: ['Basic support', '1:1 Chat', 'Connect with any tutor'],
    },
    {
      title: 'Pro',
      minutes: 90,
      price: '₹199',
      features: ['Priority support', '1:1 Video + Chat', 'Prefer tutor match'],
    },
    {
      title: 'Elite',
      minutes: 200,
      price: '₹399',
      features: ['Instant connect', '1:1 Video + Chat', 'Connect with favorite tutors'],
    },
  ];

  return (
    <>
      <StudentNavBar />
      <div className={styles.pageWrapper}>
        <button className={styles.goBackBtn} onClick={() => navigate(-1)}>← Go Back</button>

        <h1 className={styles.heading}>Upgrade to Premium</h1>
        <p className={styles.subheading}>
          Buy minutes & connect instantly with top-rated tutors.
        </p>

        <div className={styles.cardContainer}>
          {plans.map((plan, idx) => (
            <div key={idx} className={styles.planCard}>
              <h2 className={styles.planTitle}>{plan.title}</h2>
              <p className={styles.minutes}>{plan.minutes} Minutes</p>
              <p className={styles.price}>{plan.price}</p>
              <ul className={styles.featureList}>
                {plan.features.map((f, i) => (
                  <li key={i}>✓ {f}</li>
                ))}
              </ul>
              <button className={styles.buyBtn}>Buy Now</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PremiumPage;
