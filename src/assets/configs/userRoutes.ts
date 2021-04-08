interface userRoute {
    id: number,
    route: string,
    description: string,
    cover: string,
    color: string,
}

export const userRoutes: userRoute[] = [
    {
        id: 0,
        route: 'Marque a sua consulta',
        description: 'Estamos na Av. Bernardo Sayão, 3650 - Medical Center, 5º andar, sala 501. Bairro Três Poderes, Imperatriz - MA',
        cover: '/assets/images/slide-item-01.jpg',
        color: 'rgba(0, 58, 60, 0.52)',
    },
    {
        id: 1,
        route: 'Venha nos conhecer',
        description: 'Oferecemos o melhor para você que procura por Obstetrícia, Ginecologia e Reprodução Humana Assistida.',
        cover: '/assets/images/slide-item-02.jpg',
        color: 'rgba(249, 115, 82, 0.52)',
    },
    {
        id: 2,
        route: 'Exames de confiança',
        description: 'Temos os melhores profissionais e equipamentos para lhe oferecer exames e consultas de confiança.',
        cover: '/assets/images/slide-item-03.jpg',
        color: 'rgba(0, 58, 60, 0.52)',
    },
    
];

export default userRoutes;