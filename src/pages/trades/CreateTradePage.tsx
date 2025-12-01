import { useParams } from 'react-router-dom';
import { Container, Title, Text } from '../../components/ui';

export const CreateTradePage = () => {
    const { partnerId } = useParams();

    return (
        <Container className="py-8">
            <Title level={1} gradient>Create Trade</Title>
            <Text>Start a trade with user {partnerId}</Text>
            {/* TODO: Implement trade creation logic */}
        </Container>
    );
};
