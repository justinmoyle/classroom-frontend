import React from 'react';
import { useLocation, useNavigate } from 'react-router';

type EnrollmentDetails = {
  id: number;
  class?: {
    id: number;
    name: string;
  };
  subject?: {
    id: number;
    name: string;
  };
  department?: {
    id: number;
    name: string;
  };
  teacher?: {
    id: number;
    name: string;
    email: string;
  };
};

const EnrollmentConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return <div>Confirm</div>;
};
export default EnrollmentConfirm;
