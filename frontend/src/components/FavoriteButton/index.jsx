// components/FavoriteButton/index.jsx
import { useAddFavoriteMutation, useRemoveFavoriteMutation } from '../../redux/features/favoritesSlice';
import { useAuth } from '../../contexts/AuthContext';

const FavoriteButton = ({ workshopId }) => {
  const { user } = useAuth();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const handleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addFavorite({ 
        userId: user.uid, 
        itemId: workshopId 
      }).unwrap();
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  return (
    <button onClick={handleFavorite}>
      Add to Favorites
    </button>
  );
};