const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const res = await fetch('/api/admin/missions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        rewards: {
          standard: standardReward,
          gold: goldReward,
          vip: vipReward,
        },
      }),
    });

    if (!res.ok) {
      throw new Error('Errore nella creazione della missione');
    }

    const data = await res.json();
    console.log('Success:', data);
    alert('Missione caricata correttamente');
    setUrl('');
    setStandardReward(0);
    setGoldReward(0);
    setVipReward(0);
  } catch (error) {
    console.error(error);
    alert('Errore durante il caricamento della missione');
  } finally {
    setIsLoading(false);
  }
};

