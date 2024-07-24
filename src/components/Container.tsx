import React from 'react';

const Container = ({ children }: { children: React.ReactNode }) => {
	return <div className="hero min-h-screen min-w-[300px]">{children}</div>;
};

export default Container;
