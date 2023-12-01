let language = navigator?.language?.split('-')?.[0] ?? 'en'
if (!['nl', 'en'].includes(language)) language = 'en'

if (location.pathname === '/') location = `/${language}`