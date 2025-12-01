import React, { type ReactNode } from 'react';
import Card, { CardBody } from './Card';
import Text from './Text';
import Title from './Title';

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, className = '' }) => {
    return (
        <Card hover={false} className={`${className}`}>
            <CardBody className="items-center text-center py-16">
                <div className="mb-6 opacity-50">{icon}</div>
                <Title level={3} className="mb-2">{title}</Title>
                <Text variant="muted" className="mb-6 max-w-md">{description}</Text>
                {action && <div className="mt-4">{action}</div>}
            </CardBody>
        </Card>
    );
};

export default EmptyState;
