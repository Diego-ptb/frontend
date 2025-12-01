import { useNavigate } from "react-router-dom";
import { Hero, Button, Card, CardBody, CardTitle, Text, Grid, Stack } from "../../components/ui";
import { Lock, Zap, Gem } from 'lucide-react';
import { useLanguage } from "../../context/LanguageContext";

export const WelcomePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Hero
      title="SkinTrades"
      subtitle={t.welcome.subtitle}
    >
      <Stack direction="row" gap="4" className="justify-center mb-16 animate-slide-up">
        <Button size="lg" onClick={() => navigate("/auth")}>
          {t.welcome.getStarted}
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate("/marketplace")}>
          {t.welcome.exploreMarketplace}
        </Button>
      </Stack>

      <Grid cols={3} gap="6" className="max-w-5xl mx-auto">
        <Card>
          <CardBody className="items-center text-center">
            <Lock className="text-6xl mb-4" />
            <CardTitle>{t.welcome.secureTrading}</CardTitle>
            <Text variant="muted" size="sm">
              {t.welcome.secureTradingDesc}
            </Text>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="items-center text-center">
            <Zap className="text-6xl mb-4" />
            <CardTitle>{t.welcome.lightningFast}</CardTitle>
            <Text variant="muted" size="sm">
              {t.welcome.lightningFastDesc}
            </Text>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="items-center text-center">
            <Gem className="text-6xl mb-4" />
            <CardTitle>{t.welcome.rareCollections}</CardTitle>
            <Text variant="muted" size="sm">
              {t.welcome.rareCollectionsDesc}
            </Text>
          </CardBody>
        </Card>
      </Grid>
    </Hero>
  );
};