import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCart } from "../../redux/slices/CartSlice";
import bg from "../../assets/bg.png";
import { useMutation } from "@apollo/client";
import { GET_SINGLE_PRODUCT } from "../../GraphQL/Mutation";

export function ProductDetails() {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState();
  const [qty, setQty] = useState(0);
  const [singleProduct, setSingleProduct] = useState({});
  const param = useParams();
  const [getSingleProduct, { loading, error, data }] =
    useMutation(GET_SINGLE_PRODUCT);

  useEffect(() => {
    const findProduct = async () => {
      try {
        const { data } = await getSingleProduct({
          variables: {
            _id: param.id,
          },
        });
        setSingleProduct(data.getSingleProduct);
      } catch (err) {
        console.error("Failed to find product:", err);
      }
    };

    findProduct();
  }, [getSingleProduct, param.id]);
  if (loading) return <div className="min-h-[800px]">
  <h1 className="text-2xl font-bold">LOADING....</h1>;
  </div>

  const selectedSizeStyle = `border-2 border-black bg-black text-white w-[80px] h-[30px]`;

  const addToCart = () => {
    const objToDispatch = {
      size: selectedSize,
      quantity: qty,
      product: singleProduct,
    };
    dispatch(setCart(objToDispatch));
  };

  const images = singleProduct?.images || [];

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  return (
    <>
      {singleProduct ? (
        <>
          <div className="min-h-[600px] flex items-center">
            {/* image wali div */}
            <div className="w-[50%] flex gap-7 justify-center ">
              <div className=" flex flex-col gap-3">
                {singleProduct &&
                  images?.map((item, i) => (
                    <img
                      alt={`Product ${i + 1}`}
                      onClick={() => handleImageClick(i)}
                      className="w-[100px] "
                      src={item}
                    />
                  ))}
              </div>
              <div>
                <img
                  className="w-[400px] h-[400px]"
                  src={images[selectedImage]}
                  alt={`Product ${selectedImage + 1}`}
                />
              </div>
            </div>
            {/* dussri wali div */}

            <div className="w-[50%]">
              <div>
                <h1 className="text-2xl font-bold">{singleProduct?.name}</h1>
                {singleProduct &&
                  singleProduct?.colors?.map((col, i) => (
                    <span key={i} className="text-lg font-bold">
                      {col} /{" "}
                    </span>
                  ))}
                <br />
                <span className="text-lg text-red-700 line line-through">
                  {" "}
                  price ${singleProduct.price}
                </span>
                <span className="text-lg text-green-700 grow ml-6">
                  price:${singleProduct.discountedPrice}
                </span>
              </div>

              <div className="flex flex-col gap-3 mt-10 ">
                <h3 className="text-2xl font-bold">Select size</h3>
                <div className="w-[400px] flex flex-wrap gap-3">
                  {singleProduct &&
                    singleProduct?.sizes?.map((size, i) => (
                      <button
                        onClick={() => setSelectedSize(size)}
                        key={i}
                        className={
                          selectedSize == size
                            ? selectedSizeStyle
                            : "border-2 border-black  w-[80px] h-[30px]"
                        }
                        updated
                      >
                        {size}
                      </button>
                    ))}
                </div>
                <div className="flex justify-start items-center  gap-3 w-[350px]">
                  <span className="font-bold">Quantity:</span>
                  <button
                    className="border-2 w-[30px] h-[30px]  text-2xl bg-black text-white"
                    onClick={() => setQty(qty - 1)}
                  >
                    -
                  </button>
                  {qty}
                  <button
                    className="border-2 w-[30px] h-[30px] text-2xl bg-black text-white"
                    onClick={() => setQty(qty + 1)}
                  >
                    +
                  </button>
                </div>
                <Link to="/cart">
                  <button
                    onClick={addToCart}
                    className="border-2 w-[360px] h-[40px] rounded-3xl  bg-black text-white"
                  >
                    Add to Cart
                  </button>
                </Link>
                <Link to="/online-payment">
                  <button className="border-2 w-[360px] h-[40px] rounded-3xl  bg-black text-white">
                    Online Pyment
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        "Loading ..."
      )}
    </>
  );
}
